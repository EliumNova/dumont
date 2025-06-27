import { check } from "express-validator";
import { validationResult } from "express-validator";
const validateCreateUser = [
  check("Name").not().isEmpty().isString(),
  check("Email").isEmail(),
  check("DNI").not().isEmpty().isNumeric(),
  check("Password").not().isEmpty(),
  check("Telefono").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];
const validateLoginUser = [
  check("Email").isEmail(),
  check("Password").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];

const validateUpdateUser = [
  check("Name").optional().isString(),
  check("Email").optional().isEmail(),
  check("DNI").optional().isNumeric(),
  check("Telefono").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];

const UserValidations = {
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
};

export default UserValidations;
