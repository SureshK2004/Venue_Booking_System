import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: "mysql",
    dialectModule: require('mysql2'),
    logging: isProduction ? false : console.log,
    timezone: "+00:00",
    dialectOptions: {
      ssl: {
        require: true, // Railway requires SSL
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
    },
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("[DB] ✅ Connection established with Railway");
  } catch (err) {
    console.error("[DB] ❌ Connection error:", err.message);
    process.exit(1);
  }
}