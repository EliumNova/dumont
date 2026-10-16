import jwt from "jsonwebtoken";

// Duración de la sesión del panel. Configurable con JWT_EXPIRES_IN (ej. "8h").
const EXPIRA = process.env.JWT_EXPIRES_IN || "12h";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.idUsuarios,
      Name: user.Name,
      Email: user.Email,
      DNI: user.DNI,
    },
    process.env.JWT_SECRET,
    { expiresIn: EXPIRA }
  );
};

// Token de corta vida que prueba que la contraseña ya fue validada y falta el
// segundo paso (código de 6 dígitos). NO sirve para llamar a la API: checkAuth
// lo rechaza por su "purpose".
export const generateTwoFactorToken = (user) => {
  return jwt.sign(
    { id: user.idUsuarios, purpose: "2fa" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );
};

export const verifyTwoFactorToken = (token) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data?.purpose === "2fa" ? data : null;
  } catch {
    return null;
  }
};
