import rateLimit from "express-rate-limit"

export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many bookings from this IP, please try again later." },
})
