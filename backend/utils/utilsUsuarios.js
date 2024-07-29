import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.idUsuarios,
      Name: user.Name,
      Email: user.Email,
      DNI: user.DNI,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
