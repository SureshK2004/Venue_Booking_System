import { body } from "express-validator"

export const registerValidator = [
  body("name").isString().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isString().isLength({ min: 6 }).withMessage("Password min length 6"),
]

export const loginValidator = [body("email").isEmail(), body("password").isString().notEmpty()]
