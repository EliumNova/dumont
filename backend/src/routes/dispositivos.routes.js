import { Router } from "express";
import dispositivosController from "../controllers/dispositivos.controller.js";
import { checkAuth } from "../middleware/auth.js";
import dispositivosValidation from "../middleware/dispositivosValidation.js";

const dispositivosRouter = Router();
const { validateCreateDispositivos, validateUpdateDispositivos } =
  dispositivosValidation;
const {
  getDispositivos,
  getDispositivoById,
  createDispositivo,
  updateDispositivo,
  deleteDispositivo,
} = dispositivosController;
dispositivosRouter.get("/", getDispositivos);
dispositivosRouter.get("/:id", getDispositivoById);
dispositivosRouter.post(
  "/create",
  checkAuth,
  validateCreateDispositivos,
  createDispositivo
);
dispositivosRouter.put(
  "/update/:id",
  checkAuth,
  validateUpdateDispositivos,
  updateDispositivo
);
dispositivosRouter.delete("/delete/:id", deleteDispositivo);

export default dispositivosRouter;
