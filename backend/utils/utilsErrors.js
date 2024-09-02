import { ValidationError, UniqueConstraintError } from "sequelize";
import { MulterError } from "multer";
import fs from "fs";

/**
 * Maneja los errores de validación, restricciones, etc.
 * @param {string} error - @param {string} res
 */
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

export const fileError = (error, req, res) => {
  if (error instanceof MulterError) {
    if (req.file) {
      if (fs.existsSync(req.file)) fs.unlinkSync(req.file);
    }

    if (req.files) {
      const files = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();
      files.forEach((file) => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      });
    }
    // Manejo de errores de Multer
    res.status(400).send({ message: "Error al subir el archivo" });
  }
};
