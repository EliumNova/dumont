import { Router } from 'express';
import UsuariosController from '../controllers/usuarios.controller.js';
import UserValidations from '../middleware/userValidation.js';
import {
  checkAuth,
  requireAdmin,
  requireSelfOrAdmin,
} from '../middleware/auth.js';
import { Usuarios } from '../models/Usuarios.js';
import { rateLimit, claveLogin } from '../../utils/utilsSeguridad.js';

const { validateCreateUser, validateLoginUser, validateUpdateUser } =
  UserValidations;
const {
  getUsuarios,
  getUsuarioById,
  createUsuarios,
  loginUsuario,
  loginDosPasos,
  setupDosPasos,
  activarDosPasos,
  desactivarDosPasos,
  updateUsuario,
  deleteUsuario,
  verifyUsuarios,
  reenviarVerificacion,
  verifySms,
} = UsuariosController;
const usuariosRouter = Router();

// Fuerza bruta: 8 intentos de login por IP+email cada 15 min, y un tope más
// amplio por IP. El segundo paso (código de 6 dígitos) es más sensible aún.
const limiteLogin = rateLimit({
  windowMs: 15 * 60_000,
  max: 8,
  keyFn: claveLogin,
  message: 'Demasiados intentos. Esperá 15 minutos e intentá de nuevo.',
});
const limiteLoginIP = rateLimit({
  windowMs: 15 * 60_000,
  max: 40,
  keyFn: (req) => `ip|${req.ip}`,
  message: 'Demasiados intentos desde esta red. Probá más tarde.',
});
const limiteDosPasos = rateLimit({
  windowMs: 15 * 60_000,
  max: 10,
  keyFn: (req) => `2fa|${req.ip}`,
  message: 'Demasiados intentos de verificación. Esperá 15 minutos.',
});

// Alta de usuarios: solo administradores. Única excepción: el primer usuario
// del sistema (si no existe ninguno todavía), para poder arrancar.
const altaControlada = async (req, res, next) => {
  try {
    const total = await Usuarios.count();
    if (total === 0) return next();
  } catch {
    /* si falla el conteo, se exige admin igual */
  }
  return checkAuth(req, res, (err) => {
    if (err) return next(err);
    return requireAdmin(req, res, next);
  });
};

// Públicas (con límite de intentos)
usuariosRouter.post('/login', limiteLoginIP, limiteLogin, validateLoginUser, loginUsuario);
usuariosRouter.post('/login/2fa', limiteDosPasos, loginDosPasos);
usuariosRouter.post('/confirmVerify', limiteDosPasos, verifyUsuarios);
usuariosRouter.post('/reenviar-verificacion', limiteDosPasos, reenviarVerificacion);

// Verificación en 2 pasos (del usuario logueado)
usuariosRouter.post('/2fa/setup', checkAuth, setupDosPasos);
usuariosRouter.post('/2fa/enable', checkAuth, limiteDosPasos, activarDosPasos);
usuariosRouter.post('/2fa/disable', checkAuth, limiteDosPasos, desactivarDosPasos);

usuariosRouter.post('/verifysms', checkAuth, limiteDosPasos, verifySms);

usuariosRouter.post('/create', altaControlada, validateCreateUser, createUsuarios);
usuariosRouter.get('/', checkAuth, requireAdmin, getUsuarios);
usuariosRouter.get('/:id', checkAuth, requireSelfOrAdmin, getUsuarioById);
usuariosRouter.put(
  '/update/:id',
  checkAuth,
  requireSelfOrAdmin,
  validateUpdateUser,
  updateUsuario
);
usuariosRouter.delete('/delete/:id', checkAuth, requireAdmin, deleteUsuario);

export default usuariosRouter;
