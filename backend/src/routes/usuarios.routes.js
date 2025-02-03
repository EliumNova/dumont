import { Router } from 'express';
import UsuariosController from '../controllers/usuarios.controller.js';
import UserValidations from '../middleware/userValidation.js';
import { checkAuth } from '../middleware/auth.js';

const { validateCreateUser, validateLoginUser, validateUpdateUser } =
  UserValidations;
const {
  getUsuarios,
  getUsuarioById,
  createUsuarios,
  loginUsuario,
  updateUsuario,
  deleteUsuario,
  verifyUsuarios,
  verifySms,
} = UsuariosController;
const usuariosRouter = Router();

usuariosRouter.get('/', getUsuarios);
usuariosRouter.get('/:id', getUsuarioById);
usuariosRouter.post('/create', validateCreateUser, createUsuarios);
usuariosRouter.post('/confirmVerify', verifyUsuarios);
usuariosRouter.post('/login', validateLoginUser, loginUsuario);
usuariosRouter.post('/verifysms', checkAuth, verifySms);
usuariosRouter.put('/update/:id', checkAuth, validateUpdateUser, updateUsuario);
usuariosRouter.delete('/delete/:id', checkAuth, deleteUsuario);

export default usuariosRouter;
