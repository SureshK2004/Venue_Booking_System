import { body, param } from "express-validator"

export const checkAvailabilityValidator = [
  param("id").isUUID().withMessage("Invalid venue id"),
  body("hallId").isUUID().withMessage("Invalid hallId"),
  body("date").isISO8601().withMessage("Invalid date"),
  body("startTime")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Invalid startTime"),
  body("endTime")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Invalid endTime"),
]

export const createBookingValidator = [
  body("venueId").isUUID(),
  body("hallId").isUUID(),
  body("date").isISO8601(),
  body("startTime").matches(/^\d{2}:\d{2}$/),
  body("endTime").matches(/^\d{2}:\d{2}$/),
  body("guestCount").isInt({ min: 1 }),
  body("customerDetails.name").isString().isLength({ min: 2 }),
  body("customerDetails.phone").isString().isLength({ min: 6 }),
  body("customerDetails.email").isEmail(),
]
