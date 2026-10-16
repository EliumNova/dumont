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
import { ensureSchema } from "./db/ensureSchema.js";
import { checkAuth } from "./middleware/auth.js";
import { securityHeaders, rateLimit } from "../utils/utilsSeguridad.js";
import bodyParser from "body-parser";
dotenv.config();

// Sin un secreto fuerte los JWT (y el cifrado del 2FA) no sirven: se corta el
// arranque en vez de funcionar de forma insegura.
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido.");
}
if (process.env.JWT_SECRET.length < 16) {
  console.warn(
    "ADVERTENCIA: JWT_SECRET es corto; usá uno largo y aleatorio (32+ caracteres)."
  );
}

const app = express();

const PORT = process.env.PORT;

// Render (y cualquier proxy) manda la IP real en X-Forwarded-For; sin esto
// el límite de intentos vería a todos como la misma IP.
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(securityHeaders);

// Tope general por IP (las rutas sensibles, como el login, tienen el suyo).
// La tablet hace un sync cada 15 s, por eso el margen amplio.
app.use(
  "/api",
  rateLimit({ windowMs: 60_000, max: 600, keyFn: (req) => `api|${req.ip}` })
);

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));

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
await ensureSchema();

// Públicas: login (usuarios) y la API de la tablet (se identifica por su
// Código Dumont). TODO lo demás exige un JWT válido de un usuario logueado.
app.use("/api/usuarios", usuariosRouter);
app.use("/api/tablet", tabletRouter);
app.use("/api/clientes", checkAuth, clientesRouter);
app.use("/api/dispositivos", checkAuth, dispositivosRouter);
app.use("/api/files", checkAuth, filesRouter);
app.use("/api/distribuidores", checkAuth, distribuidoresRouter);
app.use("/api/clientes-distribuidores", checkAuth, clientesDistribuidoresRoutes);
app.use("/api/multimedia", checkAuth, multimediaRouter);
app.use("/api/multimedia-asignaciones", checkAuth, multimediaAsignacionesRouter);

// Healthcheck liviano (útil para Render y para el monitoreo).
app.get("/health", (_req, res) => res.send({ ok: true }));

// Manejo de errores final: nunca se devuelve el stack al cliente.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).send({ message: "Origen no permitido" });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).send({ message: "El pedido es demasiado grande" });
  }
  console.error("Error no controlado:", err);
  return res.status(500).send({ message: "Error interno del servidor" });
});

app.listen(PORT, () => {
});
