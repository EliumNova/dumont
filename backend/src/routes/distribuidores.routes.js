import { Router } from "express";
import distribuidoresController from "../controllers/distribuidores.controller.js";
const { getDistribuidores, getDistribuidoresById, 
    createDistribuidor, updateDistribuidor, deleteDistribuidor } = distribuidoresController;

const distribuidoresRouter = Router();

distribuidoresRouter.get("/", getDistribuidores);
distribuidoresRouter.get("/:id", getDistribuidoresById);
distribuidoresRouter.post("/create", createDistribuidor);
distribuidoresRouter.put("/update/:id", updateDistribuidor);
distribuidoresRouter.delete("/delete/:id", deleteDistribuidor);

export default distribuidoresRouter;
