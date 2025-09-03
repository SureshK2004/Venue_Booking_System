import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";   
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import venueRoutes from "./routes/venues.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const corsOrigin = process.env.FRONTEND_URL || "*";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);

// 404 + error handler
app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.use(errorHandler);

// For Vercel (serverless)
export const handler = serverless(app);

// For local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
