import { Router } from "express"
import { validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js"
import { User } from "../models/User.js"
import { registerValidator, loginValidator } from "../validators/authValidators.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.post("/register", registerValidator, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() })

  const { name, email, password } = req.body
  const existing = await User.findOne({ where: { email } })
  if (existing) return res.status(409).json({ message: "Email already in use" })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })
  const accessToken = signAccessToken({ sub: user.id, role: user.role })
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role })
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  })
})

router.post("/login", loginValidator, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() })

  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) return res.status(401).json({ message: "Invalid credentials" })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: "Invalid credentials" })

  const accessToken = signAccessToken({ sub: user.id, role: user.role })
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role })
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  })
})

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ message: "Missing refreshToken" })
  try {
    const payload = verifyRefreshToken(refreshToken)
    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role })
    res.json({ accessToken })
  } catch {
    res.status(401).json({ message: "Invalid refresh token" })
  }
})

router.get("/profile", requireAuth, async (req, res) => {
  res.json({ userId: req.user.sub, role: req.user.role })
})

export default router
