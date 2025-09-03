import express from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from 'express-rate-limit'
import csurf from 'csurf'
import { errorHandler } from "./middleware/errorHandler.js"
import authRoutes from "./routes/auth.js"
import venueRoutes from "./routes/venues.js"
import bookingRoutes from "./routes/bookings.js"

const app = express()

// Security middleware - Helmet first
app.use(helmet())

// Rate limiting - Early in middleware chain
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser())

// CORS configuration
const corsOrigin = process.env.FRONTEND_URL || "https://venue-booking-system-8dlf.vercel.app"
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept']
  })
)

// CSRF protection - Must come after cookieParser and sessions
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  }
})

// Apply CSRF protection to all routes except health check
app.use((req, res, next) => {
  if (req.path === '/health' || req.method === 'OPTIONS') {
    return next()
  }
  csrfProtection(req, res, next)
})

// Add CSRF token to responses
app.use((req, res, next) => {
  if (req.path !== '/health') {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: false // Frontend needs to read this
    })
  }
  next()
})

// Health check route (no CSRF protection needed)
app.get("/health", (_req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/venues", venueRoutes)
app.use("/api/bookings", bookingRoutes)

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path,
    method: req.method
  })
})

// Error handler - MUST be last middleware
app.use(errorHandler)

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  process.exit(0)
})

export default app