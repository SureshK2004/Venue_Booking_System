import { Sequelize } from "sequelize"
import dotenv from "dotenv"
dotenv.config()

export const sequelize = new Sequelize(process.env.DB_NAME || "venue_booking", process.env.DB_USER|| "root", process.env.DB_PASS ||"root", {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  dialect: "mysql",
  logging: false,
  timezone: "+00:00",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

export async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log("[DB] Connection established")
  } catch (err) {
    console.error("[DB] Connection error:", err.message)
    process.exit(1)
  }
}
