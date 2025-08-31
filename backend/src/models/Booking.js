import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/sequelize.js"

export class Booking extends Model {}

Booking.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    venueId: { type: DataTypes.UUID, allowNull: false },
    hallId: { type: DataTypes.UUID, allowNull: false },
    customerName: { type: DataTypes.STRING(255), allowNull: false },
    customerPhone: { type: DataTypes.STRING(20), allowNull: false },
    customerEmail: { type: DataTypes.STRING(255), allowNull: false },
    eventDate: { type: DataTypes.DATEONLY, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    guestCount: { type: DataTypes.INTEGER, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "confirmed" },
  },
  { sequelize, tableName: "bookings" },
)
