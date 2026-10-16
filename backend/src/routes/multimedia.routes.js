import { Router } from 'express';
import multimediaController from '../controllers/multimedia.controller.js';
import { checkAuth } from '../middleware/auth.js';

const { createMultimedia, getMultimedia, deleteMultimedia } =
  multimediaController;

const multimediaRouter = Router();

multimediaRouter.get('/', getMultimedia);
multimediaRouter.post('/', checkAuth, createMultimedia);
multimediaRouter.delete('/:id', checkAuth, deleteMultimedia);

export default multimediaRouter;
