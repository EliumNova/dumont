import { check } from "express-validator";
import { validationResult } from "express-validator";

const validateCreateClientes = [
  check("CodigoCliente").notEmpty().isString(),
  check("CodigoDistribuidor").notEmpty().isString(),
  check("Segmentacion").notEmpty().isString(),
  check("Localidad").notEmpty().isString(),
  check("Calle").notEmpty().isString(),
  check("EntreCalles").notEmpty().isString(),
  check("Telefono").notEmpty().isNumeric(),
  check("Email").isEmail(),
  check("VentaAlcohol").notEmpty().isBoolean(),
  check("WebPage").notEmpty().isURL(),
  check("HorarioVenta").notEmpty().isString(),
  check("HorarioOnOffDispositivos").notEmpty().isString(),
  check("HorarioPublicitario").notEmpty().isString(),
  check("AtencionAlCliente").notEmpty().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];

const validateUpdateClientes = [
  check("CodigoCliente").optional().isString(),
  check("CodigoDistribuidor").optional().isString(),
  check("Segmentacion").optional().isString(),
  check("Localidad").optional().isString(),
  check("Calle").optional().isString(),
  check("EntreCalles").optional().isString(),
  check("Telefono").optional().isNumeric(),
  check("Email").optional().isEmail(),
  check("VentaAlcohol").optional().isBoolean(),
  check("WebPage").optional().isURL(),
  check("HorarioVenta").optional().isString(),
  check("HorarioOnOffDispositivos").optional().isString(),
  check("HorarioPublicitario").optional().isString(),
  check("AtencionAlCliente").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];

const clientesValidation = {
  validateCreateClientes,
  validateUpdateClientes,
};

export default clientesValidation;
