import { Router } from "express";
import clientesController from "../controllers/clientes.controller.js";
import { checkAuth } from "../middleware/auth.js";
import clientesValidation from "../middleware/clientesValidation.js";

const {
  getClientes,
  getClienteById,
  getDispositivosByCliente,
  getDispositivosByClienteByParams,
  createCliente,
  updateCliente,
  deleteCliente,
} = clientesController;
const { validateCreateClientes, validateUpdateClientes } = clientesValidation;
const clientesRouter = Router();

clientesRouter.get("/", getClientes);
clientesRouter.get("/:id", getClienteById);
clientesRouter.get("/:id/dispositivos", checkAuth, getDispositivosByCliente);
clientesRouter.get("/:id/dispositivos/:options?", checkAuth, getDispositivosByClienteByParams);  //checkAuth,
clientesRouter.post("/create", checkAuth, validateCreateClientes, createCliente); //checkAuth,//validateCreateClientes, 
clientesRouter.put("/update/:id", checkAuth, validateCreateClientes, updateCliente); //checkAuth,//validateUpdateClientes,
clientesRouter.delete("/delete/:id", checkAuth, deleteCliente); //checkAuth, 

export default clientesRouter;
