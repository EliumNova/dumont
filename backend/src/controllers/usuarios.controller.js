import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PublishCommand } from '@aws-sdk/client-sns';
import { Usuarios } from '../models/Usuarios.js';
import {
  generateToken,
  generateTwoFactorToken,
  verifyTwoFactorToken,
} from '../../utils/utilsUsuarios.js';
import { handleError } from '../../utils/utilsErrors.js';
import { snsClient } from '../../utils/utilsVerify.js';
import { enviarMail, mailConfigurado } from '../../utils/mailer.js';
import { verificacionEmailHtml } from '../../utils/htmlEmails.js';
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


// ───────────── Verificación de correo ─────────────

const HORAS_VERIFICACION = 24;
const sha256 = (t) => crypto.createHash('sha256').update(t).digest('hex');

const urlFrontend = (req) =>
  (process.env.FRONTEND_URL || req.headers.origin || 'https://dumont.onrender.com').replace(/\/+$/, '');

// Genera un token nuevo (se guarda SOLO su hash), lo manda por mail y devuelve
// true si el mail salió. Si el mail no está configurado, no hace nada.
const enviarVerificacion = async (req, usuario) => {
  const token = crypto.randomBytes(32).toString('hex');
  usuario.verifyToken = sha256(token);
  usuario.expireToken = new Date(Date.now() + HORAS_VERIFICACION * 3600 * 1000);
  await usuario.save();
  const enlace = `${urlFrontend(req)}/verificar?token=${token}`;
  await enviarMail({
    to: usuario.Email,
    subject: 'Verificá tu cuenta de DuMont',
    html: verificacionEmailHtml({ nombre: usuario.Name, enlace, horas: HORAS_VERIFICACION }),
  });
};

// ───────────────────────── CRUD ─────────────────────────

const createUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const { Name, Email, DNI, Password, Telefono, isAdmin } = req.body;
    if (!passwordValida(Password)) {
      return res.status(400).send({
        message: `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`,
      });
    }
    // Con el mail configurado, el usuario nace SIN verificar y recibe un mail
    // con un enlace para activar la cuenta (no puede ingresar hasta hacerlo).
    // Sin mail configurado, se da por verificado para no dejarlo bloqueado.
    const exigeVerificacion = mailConfigurado();
    const nuevo = await Usuarios.create({
      Name,
      Email,
      Telefono: String(Telefono ?? '').replace(/\D/g, ''),
      DNI,
      Password,
      isAdmin: !!isAdmin,
      isVerified: !exigeVerificacion,
    });

    let verificacionEnviada = false;
    if (exigeVerificacion) {
      try {
        await enviarVerificacion(req, await Usuarios.unscoped().findByPk(nuevo.idUsuarios));
        verificacionEnviada = true;
      } catch (err) {
        console.error('No se pudo enviar el mail de verificación:', err.message);
      }
    }
    res.status(201).send({
      user: publico(nuevo),
      verificacionEnviada,
      requiereVerificacion: exigeVerificacion,
    });
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
        code: 'NO_VERIFICADO',
        message:
          'Tu correo todavía no fue verificado. Revisá tu bandeja de entrada (y spam) o pedí que te reenviemos el mail.',
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

// Confirma el correo con el token que llegó por mail (solo se compara el hash).
const verifyUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const token = String(req.body.token || '');
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return res.status(400).send({ message: 'El enlace de verificación no es válido.' });
    }
    const usuario = await Usuarios.unscoped().findOne({
      where: { verifyToken: sha256(token) },
    });
    if (!usuario) {
      return res.status(400).send({ message: 'El enlace no es válido o ya fue utilizado.' });
    }
    if (usuario.expireToken && Date.now() > new Date(usuario.expireToken).getTime()) {
      return res.status(400).send({
        code: 'EXPIRADO',
        message: 'El enlace venció. Pedí que te enviemos uno nuevo.',
      });
    }
    usuario.isVerified = true;
    usuario.verifyToken = null;
    usuario.expireToken = null;
    await usuario.save();
    return res.status(200).send({ message: 'Correo verificado. Ya podés iniciar sesión.' });
  } catch (error) {
    handleError(error, res);
  }
});

// Reenvía el mail de verificación. Responde siempre lo mismo para no revelar
// qué correos están registrados.
const reenviarVerificacion = expressAsyncHandler(async (req, res) => {
  try {
    const usuario = await Usuarios.unscoped().findOne({
      where: { Email: String(req.body.Email || '') },
    });
    if (usuario && !usuario.isVerified && mailConfigurado()) {
      try {
        await enviarVerificacion(req, usuario);
      } catch (err) {
        console.error('Reenvío de verificación:', err.message);
      }
    }
    res.status(200).send({
      message: 'Si el correo existe y está pendiente de verificar, te enviamos un nuevo enlace.',
    });
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
  reenviarVerificacion,
  verifySms,
};

export default UsuariosController;
