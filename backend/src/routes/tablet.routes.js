import { Router } from 'express';
import tabletController from '../controllers/tablet.controller.js';

const { sync, getEstadoConexion } = tabletController;

const tabletRouter = Router();

// Sin checkAuth: la tablet no tiene sesión de admin, se identifica solo con
// su Código Dumont (igual que hace el resto del sistema para vincular
// dispositivo <-> cliente).
tabletRouter.post('/:codigoDumont/sync', sync);
tabletRouter.get('/:codigoDumont/estado', getEstadoConexion);

export default tabletRouter;
