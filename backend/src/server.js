import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"
import { connectDB, sequelize } from "./config/sequelize.js"
import "./models/index.js"

const PORT = Number(process.env.PORT || 5000)
;(async () => {
  await connectDB()
  await sequelize.sync()
  app.listen(PORT, () => console.log(`[Server] Listening on http://localhost:${PORT}`))
})()
