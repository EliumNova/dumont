import express from 'express';
import { getRelacionesClientesDistribuidores } from '../controllers/clientesDistribuidores.controller.js';

const router = express.Router();

router.get('/', getRelacionesClientesDistribuidores);

export default router;
