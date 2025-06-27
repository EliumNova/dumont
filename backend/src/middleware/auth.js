import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
  try {
    console.log(process.env.JWT_SECRET);
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
export const checkAuth = async (req, res, next) => {
  try {
    //token bearer
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = await verifyToken(token);

    if (tokenData) {
      next();
    } else {
      res.status(401).send({ message: "Invalid Token" });
    }
  } catch (e) {
    if (e.message === "jwt expired") {
      res.status(401).send({ message: "Token expired" });
    }
    res.status(401).send({ message: "Invalid Token" });
  }
};
