import { Router } from 'express';
import clientesController from '../controllers/clientes.controller.js';
import { checkAuth } from '../middleware/auth.js';
import clientesValidation from '../middleware/clientesValidation.js';

const {
  getClientes,
  getClienteById,
  getClienteByCodigoDumont,
  getDispositivosByCliente,
  getDispositivosByClienteByParams,
  createCliente,
  updateCliente,
  deleteCliente,
  getDistribuidores, // Importa el nuevo método
} = clientesController;

const { validateCreateClientes, validateUpdateClientes } = clientesValidation;
const clientesRouter = Router();

// Rutas existentes
clientesRouter.get('/', getClientes);
clientesRouter.get('/:id', getClienteById);
clientesRouter.get('/dumont/:codigoDumont', getClienteByCodigoDumont);
clientesRouter.get('/:id/dispositivos', checkAuth, getDispositivosByCliente);
clientesRouter.get(
  '/:id/dispositivos/:options?',
  checkAuth,
  getDispositivosByClienteByParams
);
clientesRouter.post('/create', validateCreateClientes, createCliente);
clientesRouter.put('/update/:id', validateCreateClientes, updateCliente);
clientesRouter.delete('/delete/:id', deleteCliente);

// Nueva ruta para obtener distribuidores
clientesRouter.get('/distribuidores/list', getDistribuidores); // Ruta para obtener la lista de distribuidores

export default clientesRouter;
