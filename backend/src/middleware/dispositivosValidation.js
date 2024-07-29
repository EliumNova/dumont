import { check } from "express-validator";
import { validationResult } from "express-validator";
const validateCreateDispositivos = [
  check("Marca").notEmpty().isString(),
  check("Modelo").notEmpty().isString(),
  check("Numero").notEmpty().isNumeric(),
  check("NumSerie").notEmpty().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];
const validateUpdateDispositivos = [
  check("Marca").optional().isString(),
  check("Modelo").optional().isString(),
  check("Numero").optional().isNumeric(),
  check("NumSerie").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];

const dispositivosValidation = {
  validateCreateDispositivos,
  validateUpdateDispositivos,
};

export default dispositivosValidation;
