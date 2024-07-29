import { ValidationError, UniqueConstraintError } from "sequelize";
export const handleError = (error, res) => {
  if (error instanceof ValidationError) {
    // Manejo de errores de validación
    const messages = error.errors.map((e) => e.message);
    res.status(400).send({ message: "Error de validación", errors: messages });
  } else if (error instanceof UniqueConstraintError) {
    // Manejo de errores de restricción única
    res.status(409).send({ message: "El recurso ya existe" });
  } else {
    // Manejo de otros tipos de errores
    console.log(error);
    res.status(500).send({ message: "Error interno del servidor" });
  }
};
