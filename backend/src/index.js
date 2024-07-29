import dotenv from "dotenv";
import express from "express";
import "./models/Dispositivos.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import dispositivosRouter from "./routes/dispositivos.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./models/Usuarios.js";
import "./models/Clientes.js";
import "./models/Dispositivos.js";
import { sequelize } from "./db/db.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.static("./public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const main = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.use("/usuarios", usuariosRouter);
    app.use("/clientes", clientesRouter);
    app.use("/dispositivos", dispositivosRouter);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();
