import { check } from "express-validator";
import { validationResult } from "express-validator";

const validateCreateClientes = [
  check("NombreCompleto")
    .notEmpty()
    .withMessage("El nombre completo es obligatorio")
    .isString(),
  check("CodigoCliente")
    .notEmpty()
    .withMessage("El código de cliente es obligatorio")
    .isString(),
  check("Segmentacion")
    .notEmpty()
    .withMessage("La segmentación es obligatoria")
    .isString(),
  check("CondicionFiscal")
    .notEmpty()
    .withMessage("La Condición Fiscal es obligatoria")
    .isString(),
  check("CodigoDistribuidor")
    .notEmpty()
    .withMessage("El código de distribuidor es obligatorio")
    .isString(),
  check("CorreoElectronico")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail(),
  check("VentaAlcohol")
    .notEmpty()
    .withMessage("El campo VentaAlcohol es obligatorio")
    .isBoolean(),
  check("Telefono")
    .notEmpty()
    .withMessage("El teléfono es obligatorio")
    .isString(),
  check("localidad")
    .notEmpty()
    .withMessage("La localidad es obligatoria")
    .isString(),
  check("calle").notEmpty().withMessage("La calle es obligatoria").isString(),
  check("altura").notEmpty().withMessage("La altura es obligatoria").isString(),
  check("entreCalle1")
    .notEmpty()
    .withMessage("La entrecalle 1 es obligatoria")
    .isString(),
  check("entreCalle2")
    .notEmpty()
    .withMessage("La entrecalle 2 es obligatoria")
    .isString(),
  check("HorarioVenta")
    .notEmpty()
    .withMessage("El horario de venta es obligatorio")
    .isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];

const validateUpdateClientes = [
  check("principales").optional().isObject(),
  check("ubicacion").optional().isObject(),
  check("ubicacion.localidad").optional().isString(),
  check("ubicacion.calle").optional().isString(),
  check("ubicacion.altura").optional().isString(),
  check("ubicacion.entreCalle1").optional().isString(),
  check("ubicacion.entreCalle2").optional().isString(),
  check("ubicacion.latitud").optional().isString(),
  check("ubicacion.longitud").optional().isString(),
  check("horus").optional().isObject(),
  check("horus.saleHorusFrom").optional().isString(),
  check("horus.saleHorusTo").optional().isString(),
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
