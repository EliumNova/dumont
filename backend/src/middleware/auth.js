import jwt from "jsonwebtoken";
import { Usuarios } from "../models/Usuarios.js";

// Devuelve el payload del token, o null si es inválido/expirado.
export const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    // Header esperado: "Authorization: Bearer <token>"
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).send({ message: "Invalid Token" });
    }

    let tokenData;
    try {
      tokenData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired" });
      }
      return res.status(401).send({ message: "Invalid Token" });
    }

    // Los tokens del "segundo paso" del login no habilitan la API.
    if (!tokenData || tokenData.purpose) {
      return res.status(401).send({ message: "Invalid Token" });
    }
    req.user = tokenData;
    return next();
  } catch (e) {
    return res.status(401).send({ message: "Invalid Token" });
  }
};

// Exige que el usuario autenticado sea administrador (se consulta la base en
// cada pedido, así quitar el rol surte efecto sin esperar a que venza el token).
// Debe usarse DESPUÉS de checkAuth.
export const requireAdmin = async (req, res, next) => {
  try {
    const usuario = await Usuarios.findByPk(req.user?.id, {
      attributes: ["idUsuarios", "isAdmin"],
    });
    if (!usuario) return res.status(401).send({ message: "Invalid Token" });
    if (!usuario.isAdmin) {
      return res.status(403).send({ message: "Requiere permisos de administrador" });
    }
    return next();
  } catch (e) {
    return res.status(500).send({ message: "Error interno del servidor" });
  }
};

// Permite la acción al propio usuario (:id == su id) o a un administrador.
export const requireSelfOrAdmin = async (req, res, next) => {
  if (req.user?.id && req.user.id === req.params.id) return next();
  return requireAdmin(req, res, next);
};
