import dotenv from "dotenv";
import express from "express";
import "./models/Dispositivos.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import dispositivosRouter from "./routes/dispositivos.routes.js";
import filesRouter from "./routes/files.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./models/Usuarios.js";
import "./models/Clientes.js";
import "./models/Dispositivos.js";
import { sequelize } from "./db/db.js";
import bodyParser from "body-parser";
dotenv.config();

const app = express();

const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./public"));
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

await sequelize.authenticate();
await sequelize.sync();
app.use("/api/usuarios", usuariosRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/dispositivos", dispositivosRouter);
app.use("/api/files", filesRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
console.log("Connection has been established successfully.");
