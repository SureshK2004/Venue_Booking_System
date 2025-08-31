import { Router } from "express"
import { Venue } from "../models/Venue.js"
import { Hall } from "../models/Hall.js"
import { Booking } from "../models/Booking.js"
import { validationResult } from "express-validator"
import { checkAvailabilityValidator } from "../validators/bookingValidators.js"
import { Op, where, fn, col } from "sequelize"

const router = Router()

router.get("/", async (req, res) => {
  const venues = await Venue.findAll({
    attributes: ["id", "name", "address", "city", "description", "images", "rating", "priceRangeMin", "priceRangeMax"],
    include: [{ model: Hall, as: "halls", attributes: ["id", "name", "capacityMin", "capacityMax", "pricePerHour"] }],
    order: [["name", "ASC"]],
  })
  res.json(venues)
})

router.get("/:id", async (req, res) => {
  const venue = await Venue.findByPk(req.params.id, {
    include: [{ model: Hall, as: "halls" }],
  })
  if (!venue) return res.status(404).json({ message: "Venue not found" })

  // Mock availability for next 7 days for UI calendar
  const today = new Date()
  const availability = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    return {
      date: d.toISOString().slice(0, 10),
      available: Math.random() > 0.2, // 80% chance available
    }
  })

  res.json({ ...venue.toJSON(), availability })
})

router.post("/:id/check-availability", checkAvailabilityValidator, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() })

  const { id } = req.params
  const { hallId, date, startTime, endTime } = req.body

  const hall = await Hall.findOne({ where: { id: hallId, venueId: id } })
  if (!hall) return res.status(404).json({ message: "Hall not found for this venue" })

  if (startTime >= endTime) return res.status(400).json({ message: "startTime must be before endTime" })

  const conflicts = await Booking.findAll({
    where: {
      hallId,
      eventDate: date,
      [Op.and]: [where(fn("TIME", col("startTime")), "<", endTime), where(fn("TIME", col("endTime")), ">", startTime)],
    },
    order: [["startTime", "ASC"]],
  })

  const available = conflicts.length === 0
  res.json({ available, conflicts })
})

export default router
