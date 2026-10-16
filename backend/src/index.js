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

app.use(express.static("./public"));
app.use(cookieParser());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://dumont.onrender.com",
    ];

    // Para probar en dispositivos reales (tablet física, celular, etc.) hay
    // que entrar por la IP de red local de esta compu (ej. 172.30.240.1),
    // no por "localhost" — localhost en la tablet apuntaría a la tablet
    // misma, no a tu compu. Antes eso quedaba bloqueado por CORS. Esto
    // permite cualquier IP de red local (192.168.x.x, 10.x.x.x,
    // 172.16-31.x.x) siempre que use el mismo puerto del frontend (3000).
    const esRedLocalPuerto3000 =
      /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):3000$/.test(
        origin || "",
      );

    if (!origin || allowedOrigins.includes(origin) || esRedLocalPuerto3000) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

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
  console.log(`Server is running on port ${PORT}`);
});
console.log("Connection has been established successfully.");
