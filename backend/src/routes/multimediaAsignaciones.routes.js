import { Router } from 'express';
import multimediaAsignacionesController from '../controllers/multimediaAsignaciones.controller.js';
import { checkAuth } from '../middleware/auth.js';

const { createAsignaciones, getAsignaciones, deleteAsignacion } =
  multimediaAsignacionesController;

const multimediaAsignacionesRouter = Router();

multimediaAsignacionesRouter.get('/', getAsignaciones);
multimediaAsignacionesRouter.post('/', checkAuth, createAsignaciones);
multimediaAsignacionesRouter.delete('/:id', checkAuth, deleteAsignacion);

export default multimediaAsignacionesRouter;
