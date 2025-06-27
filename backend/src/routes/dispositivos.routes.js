import { Router } from 'express';
import dispositivosController from '../controllers/dispositivos.controller.js';
import { checkAuth } from '../middleware/auth.js';
import dispositivosValidation from '../middleware/dispositivosValidation.js';

const dispositivosRouter = Router();
const { validateCreateDispositivos, validateUpdateDispositivos } =
  dispositivosValidation;
const {
  getDispositivos,
  getDispositivoById,
  createDispositivo,
  updateDispositivo,
  deleteDispositivo,
  getAllDispositivosNoPaginate,
} = dispositivosController;

dispositivosRouter.get('/', getDispositivos);
dispositivosRouter.get('/all', getAllDispositivosNoPaginate);

dispositivosRouter.get('/:id', getDispositivoById);
dispositivosRouter.post(
  '/create',
  validateCreateDispositivos,
  createDispositivo
);
dispositivosRouter.put(
  '/update/:id',
  checkAuth,
  validateUpdateDispositivos,
  updateDispositivo
);
dispositivosRouter.delete('/delete/:id', checkAuth, deleteDispositivo);

export default dispositivosRouter;
