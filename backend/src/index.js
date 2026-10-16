import dotenv from "dotenv";
import express from "express";
import "./models/Dispositivos.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import dispositivosRouter from "./routes/dispositivos.routes.js";
import filesRouter from "./routes/files.routes.js";
import distribuidoresRouter from "./routes/distribuidores.routes.js";
import clientesDistribuidoresRoutes from "./routes/clientesDistribuidores.routes.js";
import multimediaRouter from "./routes/multimedia.routes.js";
import multimediaAsignacionesRouter from "./routes/multimediaAsignaciones.routes.js";
import tabletRouter from "./routes/tablet.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./models/Usuarios.js";
import "./models/Clientes.js";
import "./models/Dispositivos.js";
import "./models/Distribuidores.js";
import "./models/Multimedia.js";
import "./models/MultimediaAsignacion.js";
import "./models/index.js";
import { sequelize } from "./db/db.js";
import bodyParser from "body-parser";
dotenv.config();

const app = express();

const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Orígenes permitidos por CORS: variable CORS_ORIGINS (lista separada por comas).
// Si no está definida se usa el comportamiento histórico (localhost:3000 y
// dumont.onrender.com).
const DEFAULT_CORS_ORIGINS = [
  "http://localhost:3000",
  "https://dumont.onrender.com",
];
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const corsOrigins = allowedOrigins.length ? allowedOrigins : DEFAULT_CORS_ORIGINS;

// Para probar en dispositivos reales (tablet física, celular) se entra por la
// IP de red local de la compu, no por "localhost". Fuera de producción se
// permite cualquier IP de red local (192.168.x.x, 10.x.x.x, 172.16-31.x.x) con
// el puerto 3000. Se puede forzar con CORS_ALLOW_LAN=true/false.
const allowLan =
  process.env.CORS_ALLOW_LAN !== undefined
    ? process.env.CORS_ALLOW_LAN === "true"
    : process.env.NODE_ENV !== "production";
const redLocalPuerto3000 =
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):3000$/;

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      corsOrigins.includes(origin) ||
      (allowLan && redLocalPuerto3000.test(origin))
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Archivos subidos (imágenes/videos). Va DESPUÉS de cors() para que también
// lleven los headers CORS: la app de la tablet los descarga con fetch() para
// guardarlos en su cache local y reproducirlos sin internet.
app.use(express.static("./public"));

app.use(express.urlencoded({ extended: true }));

await sequelize.authenticate();
await sequelize.sync();
app.use("/api/usuarios", usuariosRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/dispositivos", dispositivosRouter);
app.use("/api/files", filesRouter);
app.use("/api/distribuidores", distribuidoresRouter);
app.use("/api/clientes-distribuidores", clientesDistribuidoresRoutes);
app.use("/api/multimedia", multimediaRouter);
app.use("/api/multimedia-asignaciones", multimediaAsignacionesRouter);
app.use("/api/tablet", tabletRouter);

app.listen(PORT, () => {
});
