import { Router } from "express"
import { validationResult } from "express-validator"
import { createBookingValidator } from "../validators/bookingValidators.js"
import { bookingLimiter } from "../middleware/rateLimit.js"
import { Venue } from "../models/Venue.js"
import { Hall } from "../models/Hall.js"
import { Booking } from "../models/Booking.js"
import { Op, where, fn, col } from "sequelize"

const router = Router()

router.post("/", bookingLimiter, createBookingValidator, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() })

  const { venueId, hallId, date, startTime, endTime, guestCount, customerDetails } = req.body

  const venue = await Venue.findByPk(venueId)
  if (!venue) return res.status(404).json({ message: "Venue not found" })
  const hall = await Hall.findOne({ where: { id: hallId, venueId } })
  if (!hall) return res.status(404).json({ message: "Hall not found for this venue" })

  if (startTime >= endTime) return res.status(400).json({ message: "startTime must be before endTime" })

  const conflicts = await Booking.findAll({
    where: {
      hallId,
      eventDate: date,
      [Op.and]: [where(fn("TIME", col("startTime")), "<", endTime), where(fn("TIME", col("endTime")), ">", startTime)],
    },
  })
  if (conflicts.length > 0) return res.status(409).json({ message: "Time slot not available", conflicts })

  // Calculate total amount
  const [sh, sm] = startTime.split(":").map(Number)
  const [eh, em] = endTime.split(":").map(Number)
  const hours = Math.max(0.5, eh + em / 60 - (sh + sm / 60))
  const totalAmount = (Number(hall.pricePerHour) * hours).toFixed(2)

  const booking = await Booking.create({
    venueId,
    hallId,
    customerName: customerDetails.name,
    customerPhone: customerDetails.phone,
    customerEmail: customerDetails.email,
    eventDate: date,
    startTime,
    endTime,
    guestCount,
    totalAmount,
    userId: req.user?.sub ?? null,
    status: "confirmed",
  })

  res.status(201).json({ id: booking.id, totalAmount, status: booking.status })
})

export default router
