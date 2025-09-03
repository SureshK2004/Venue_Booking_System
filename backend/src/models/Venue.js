import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/sequelize.js"

export class Venue extends Model {}

Venue.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 4.5,
    },
    priceRangeMin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 100,
    },
    priceRangeMax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 500,
    },
    // 👇 Add this new field
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { sequelize, tableName: "venues" }
)
