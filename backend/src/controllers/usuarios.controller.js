import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { PublishCommand } from '@aws-sdk/client-sns';
import { Usuarios } from '../models/Usuarios.js';
import {
  generateToken,
  generateTwoFactorToken,
  verifyTwoFactorToken,
} from '../../utils/utilsUsuarios.js';
import { handleError } from '../../utils/utilsErrors.js';
import { snsClient } from '../../utils/utilsVerify.js';
import {
  generarSecreto,
  verificarTotp,
  urlOtpauth,
  cifrar,
  descifrar,
  generarCodigosRecuperacion,
  consumirCodigoRecuperacion,
} from '../../utils/utilsTotp.js';

const PASSWORD_MIN = 8;
// Hash de relleno: se compara igual cuando el email no existe, para que el
// tiempo de respuesta no revele si el usuario está registrado.
const HASH_DUMMY = bcrypt.hashSync('dumont-dummy-password', 10);

// Datos que se devuelven del usuario al frontend (nunca hashes ni secretos).
const publico = (u) => ({
  id: u.idUsuarios,
  idUsuarios: u.idUsuarios,
  Name: u.Name,
  Email: u.Email,
  Telefono: u.Telefono,
  DNI: u.DNI,
  isAdmin: u.isAdmin,
  isVerified: u.isVerified,
  TwoFactorEnabled: !!u.TwoFactorEnabled,
});

const sesion = (u) => ({ ...publico(u), token: generateToken(u) });

const passwordValida = (p) => typeof p === 'string' && p.length >= PASSWORD_MIN;

// ───────────────────────── CRUD ─────────────────────────

const createUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const { Name, Email, DNI, Password, Telefono, isAdmin } = req.body;
    if (!passwordValida(Password)) {
      return res.status(400).send({
        message: `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`,
      });
    }
    // Lo crea un admin autenticado (ver rutas) o es el primer usuario del
    // sistema, así que se da por verificado: el flujo por mail no está activo.
    const nuevo = await Usuarios.create({
      Name,
      Email,
      Telefono,
      DNI,
      Password,
      isAdmin: !!isAdmin,
      isVerified: true,
    });
    res.status(201).send({ user: publico(nuevo) });
  } catch (error) {
    handleError(error, res);
  }
});

const getUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({ order: [['Name', 'ASC']] });
    res.send(usuarios.map(publico));
  } catch (error) {
    handleError(error, res);
  }
});

const getUsuarioById = expressAsyncHandler(async (req, res) => {
  try {
    const usuario = await Usuarios.findByPk(req.params.id);
    if (!usuario) return res.status(404).send({ message: 'Usuario no encontrado' });
    res.send(publico(usuario));
  } catch (error) {
    handleError(error, res);
  }
});

const updateUsuario = expressAsyncHandler(async (req, res) => {
  try {
    const { Name, Email, DNI, Password, Telefono, isAdmin } = req.body;
    const usuario = await Usuarios.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    const solicitante = await Usuarios.findByPk(req.user.id, {
      attributes: ['idUsuarios', 'isAdmin'],
    });
    const esAdmin = !!solicitante?.isAdmin;

    if (Name !== undefined) usuario.Name = Name;
    if (Email !== undefined) usuario.Email = Email;
    if (DNI !== undefined) usuario.DNI = DNI;
    if (Telefono !== undefined) usuario.Telefono = Telefono;

    // Solo un admin puede cambiar roles, y nadie se quita el rol a sí mismo
    // (evita dejar el sistema sin administradores).
    if (isAdmin !== undefined && esAdmin && usuario.idUsuarios !== req.user.id) {
      usuario.isAdmin = !!isAdmin;
    }

    // El setter del modelo ya hashea: solo se asigna si viene una nueva.
    if (Password !== undefined && Password !== '') {
      if (!passwordValida(Password)) {
        return res.status(400).send({
          message: `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`,
        });
      }
      usuario.Password = Password;
    }

    await usuario.save();
    res.send(publico(usuario));
  } catch (error) {
    handleError(error, res);
  }
});

const deleteUsuario = expressAsyncHandler(async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res
        .status(400)
        .send({ message: 'No podés eliminar tu propio usuario' });
    }
    const borrados = await Usuarios.destroy({
      where: { idUsuarios: req.params.id },
    });
    if (!borrados) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    res.send({ message: 'Usuario eliminado' });
  } catch (error) {
    handleError(error, res);
  }
});

// ───────────────────────── Login (+ 2FA) ─────────────────────────

const loginUsuario = expressAsyncHandler(async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const usuario = await Usuarios.unscoped().findOne({
      where: { Email: String(Email || '') },
    });

    // Siempre se hace una comparación bcrypt, exista o no el usuario.
    const coincide = bcrypt.compareSync(
      String(Password || ''),
      usuario ? usuario.Password : HASH_DUMMY
    );

    if (!usuario || !coincide) {
      return res
        .status(401)
        .send({ message: 'Email o contraseña incorrectos' });
    }

    if (!usuario.isVerified) {
      return res.status(403).send({
        message:
          'Tu usuario todavía no fue verificado. Pedile a un administrador que lo active.',
      });
    }

    if (usuario.TwoFactorEnabled) {
      return res.status(200).send({
        requires2FA: true,
        twoFactorToken: generateTwoFactorToken(usuario),
      });
    }

    return res.status(200).send(sesion(usuario));
  } catch (error) {
    handleError(error, res);
  }
});

// Segundo paso del login: código de 6 dígitos de la app, o un código de
// recuperación de un solo uso.
const loginDosPasos = expressAsyncHandler(async (req, res) => {
  try {
    const { twoFactorToken, code } = req.body;
    const datos = verifyTwoFactorToken(twoFactorToken);
    if (!datos) {
      return res.status(401).send({
        message: 'La verificación expiró. Volvé a iniciar sesión.',
      });
    }
    const usuario = await Usuarios.unscoped().findByPk(datos.id);
    if (!usuario || !usuario.TwoFactorEnabled || !usuario.TwoFactorSecret) {
      return res.status(401).send({ message: 'Verificación inválida' });
    }

    const valido = await validarSegundoFactor(usuario, code);
    if (!valido) {
      return res.status(401).send({ message: 'Código incorrecto' });
    }
    return res.status(200).send(sesion(usuario));
  } catch (error) {
    handleError(error, res);
  }
});

// Acepta TOTP (anti-reuso por paso) o código de recuperación. Persiste los
// cambios (último paso usado / código de recuperación consumido).
async function validarSegundoFactor(usuario, code) {
  const secreto = descifrar(usuario.TwoFactorSecret);
  const paso = verificarTotp(secreto, code);
  if (paso !== null) {
    if (usuario.TwoFactorLastStep != null && paso <= usuario.TwoFactorLastStep) {
      return false; // el mismo código ya se usó
    }
    usuario.TwoFactorLastStep = paso;
    await usuario.save();
    return true;
  }
  // ¿Será un código de recuperación (XXXX-XXXX)?
  if (/^[A-Za-z0-9]{4}-?[A-Za-z0-9]{4}$/.test(String(code || '').trim())) {
    const guardados = JSON.parse(usuario.TwoFactorRecovery || '[]');
    const restantes = consumirCodigoRecuperacion(guardados, code);
    if (restantes) {
      usuario.TwoFactorRecovery = JSON.stringify(restantes);
      await usuario.save();
      return true;
    }
  }
  return false;
}

// ───────────────────────── Gestión de 2FA ─────────────────────────

// 1) Genera un secreto nuevo (todavía NO activo) para escanear/cargar en la app.
const setupDosPasos = expressAsyncHandler(async (req, res) => {
  try {
    const usuario = await Usuarios.unscoped().findByPk(req.user.id);
    if (!usuario) return res.status(404).send({ message: 'Usuario no encontrado' });
    if (usuario.TwoFactorEnabled) {
      return res.status(400).send({ message: 'La verificación en 2 pasos ya está activa' });
    }
    const secreto = generarSecreto();
    usuario.TwoFactorSecret = cifrar(secreto);
    await usuario.save();
    res.send({
      secret: secreto,
      otpauthUrl: urlOtpauth(secreto, usuario.Email),
    });
  } catch (error) {
    handleError(error, res);
  }
});

// 2) Confirma con un código real de la app y activa. Devuelve los códigos de
// recuperación UNA sola vez.
const activarDosPasos = expressAsyncHandler(async (req, res) => {
  try {
    const usuario = await Usuarios.unscoped().findByPk(req.user.id);
    if (!usuario?.TwoFactorSecret) {
      return res.status(400).send({ message: 'Primero iniciá la configuración' });
    }
    if (usuario.TwoFactorEnabled) {
      return res.status(400).send({ message: 'Ya está activa' });
    }
    const paso = verificarTotp(descifrar(usuario.TwoFactorSecret), req.body.code);
    if (paso === null) {
      return res.status(400).send({ message: 'Código incorrecto' });
    }
    const { claros, hashes } = generarCodigosRecuperacion();
    usuario.TwoFactorEnabled = true;
    usuario.TwoFactorLastStep = paso;
    usuario.TwoFactorRecovery = JSON.stringify(hashes);
    await usuario.save();
    res.send({ enabled: true, recoveryCodes: claros });
  } catch (error) {
    handleError(error, res);
  }
});

// Desactivar exige la contraseña Y un código válido (si le roban la sesión,
// no pueden apagar el 2FA).
const desactivarDosPasos = expressAsyncHandler(async (req, res) => {
  try {
    const { Password, code } = req.body;
    const usuario = await Usuarios.unscoped().findByPk(req.user.id);
    if (!usuario?.TwoFactorEnabled) {
      return res.status(400).send({ message: 'La verificación en 2 pasos no está activa' });
    }
    if (!bcrypt.compareSync(String(Password || ''), usuario.Password)) {
      return res.status(401).send({ message: 'Contraseña incorrecta' });
    }
    if (!(await validarSegundoFactor(usuario, code))) {
      return res.status(401).send({ message: 'Código incorrecto' });
    }
    usuario.TwoFactorEnabled = false;
    usuario.TwoFactorSecret = null;
    usuario.TwoFactorRecovery = null;
    usuario.TwoFactorLastStep = null;
    await usuario.save();
    res.send({ enabled: false });
  } catch (error) {
    handleError(error, res);
  }
});

// ───────────────────────── Verificación (legacy) ─────────────────────────

const verifyUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const { idUsuarios, verifyToken } = req.body;
    const usuario = await Usuarios.unscoped().findByPk(idUsuarios);
    if (!usuario) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    if (!usuario.verifyToken || usuario.verifyToken !== String(verifyToken)) {
      return res.status(401).send({ message: 'Token de verificación incorrecto' });
    }
    if (usuario.expireToken && Date.now() > new Date(usuario.expireToken).getTime()) {
      return res.status(401).send({ message: 'Token de verificación expirado' });
    }
    usuario.isVerified = true;
    usuario.verifyToken = null;
    usuario.expireToken = null;
    await usuario.save();
    return res.status(200).send({ usuario: publico(usuario), message: 'Usuario verificado' });
  } catch (error) {
    handleError(error, res);
  }
});

const verifySms = expressAsyncHandler(async (req, res) => {
  try {
    const usuario = await Usuarios.unscoped().findByPk(req.user.id);
    if (!usuario) return res.status(404).send({ message: 'Usuario no encontrado' });

    const telefono = usuario.Telefono.startsWith('+')
      ? usuario.Telefono
      : `+${usuario.Telefono}`;
    const codigo = String(Math.floor(1000 + Math.random() * 9000)); // 4 dígitos
    usuario.verifyToken = codigo;
    usuario.expireToken = new Date(Date.now() + 2 * 60 * 1000);
    await usuario.save();

    await snsClient.send(
      new PublishCommand({
        Message: `Tu codigo Dumont es: ${codigo}`,
        PhoneNumber: telefono,
      })
    );
    // El código NO se devuelve al cliente: llega solo por SMS.
    res.status(200).send({ message: 'Código enviado por SMS' });
  } catch (err) {
    console.error('verifySms:', err.message);
    res.status(500).send({ message: 'Falló el envío del mensaje' });
  }
});

const UsuariosController = {
  createUsuarios,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  loginDosPasos,
  setupDosPasos,
  activarDosPasos,
  desactivarDosPasos,
  verifyUsuarios,
  verifySms,
};

export default UsuariosController;
