import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/sequelize.js"

export class Hall extends Model {}

Hall.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    venueId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    capacityMin: { type: DataTypes.INTEGER, allowNull: false },
    capacityMax: { type: DataTypes.INTEGER, allowNull: false },
    pricePerHour: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    amenities: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  },
  { sequelize, tableName: "halls" },
)
