import { check, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateCreateDispositivos = [
  check('Marca')
    .notEmpty()
    .withMessage('Marca es requerida')
    .isString()
    .withMessage('Marca debe ser un string'),

  check('Modelo')
    .notEmpty()
    .withMessage('Modelo es requerido')
    .isString()
    .withMessage('Modelo debe ser un string'),

  check('NumSerie')
    .notEmpty()
    .withMessage('Número de serie es requerido')
    .isString()
    .withMessage('Número de serie debe ser un string'),

  check('CodigoCliente')
    .notEmpty()
    .withMessage('Debes seleccionar un cliente')
    .isString()
    .withMessage('CodigoCliente debe ser un string'),

  check('latitud')
    .optional()
    .isString()
    .withMessage('latitud debe ser numérico'),

  check('longitud')
    .optional()
    .isString()
    .withMessage('longitud debe ser numérico'),

  handleValidationErrors,
];

const validateUpdateDispositivos = [
  check('Marca').optional().isString().withMessage('Marca debe ser un string'),

  check('Modelo')
    .optional()
    .isString()
    .withMessage('Modelo debe ser un string'),

  check('NumSerie')
    .optional()
    .isString()
    .withMessage('Número de serie debe ser un string'),

  check('CodigoCliente')
    .optional()
    .isString()
    .withMessage('CodigoCliente debe ser un string'),

  check('CodigoDumont')
    .optional()
    .isString()
    .withMessage('CodigoDumont debe ser un string'),

  handleValidationErrors,
];

const dispositivosValidation = {
  validateCreateDispositivos,
  validateUpdateDispositivos,
};

export default dispositivosValidation;
