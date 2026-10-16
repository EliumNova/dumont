import jwt from "jsonwebtoken";

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

    if (!tokenData) {
      return res.status(401).send({ message: "Invalid Token" });
    }
    return next();
  } catch (e) {
    return res.status(401).send({ message: "Invalid Token" });
  }
};
