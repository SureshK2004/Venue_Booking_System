import dotenv from "dotenv";
dotenv.config();
import { connectDB, sequelize } from "./src/config/sequelize.js";
import { Venue } from "./src/models/Venue.js";
import { Hall } from "./src/models/Hall.js";
import { User } from "./src/models/User.js";
import { Booking } from "./src/models/Booking.js";
import "./src/models/index.js";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    await connectDB();
    await sequelize.sync({ force: true });
    console.log("✅ Synced schema");

    // Users
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "admin",
    });

    const user = await User.create({
      name: "Jane Doe",
      email: "jane@example.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "customer",
    });

    console.log("👤 Users inserted");

    // Venues (create one by one for MySQL)
    const grand = await Venue.create({
      name: "Grand Palace",
      address: "123 Main St",
      city: "Metropolis",
      description: "A luxurious venue perfect for weddings and conferences.",
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=60",
      ],
      rating: 4.7,
      priceRangeMin: 150,
      priceRangeMax: 600,
    });

       const gardenPavilion = await Venue.create({
      name: "Garden Pavilion",
      address: "789 Nature Road",
      city: "Greenville",
      description: "Beautiful outdoor venue surrounded by nature.",
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=60",
      
        "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&auto=format&fit=crop&q=60",
      ],
      rating: 4.5,
      priceRangeMin: 80,
      priceRangeMax: 300,
    });

    const center = await Venue.create({
      name: "City Convention Center",
      address: "456 Broad Ave",
      city: "Gotham",
      description: "Modern spaces for corporate events and trade shows.",
      images: [
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=60",
      ],
      rating: 4.4,
      priceRangeMin: 120,
      priceRangeMax: 500,
    });

    console.log("🏢 Venues inserted");

    // Halls
    const halls = await Hall.bulkCreate(
      [
        {
          venueId: grand.id,
          name: "Emerald Hall",
          capacityMin: 50,
          capacityMax: 200,
          pricePerHour: 250,
          amenities: ["Stage", "Sound System", "Catering"],
        },
        {
          venueId: grand.id,
          name: "Crystal Hall",
          capacityMin: 30,
          capacityMax: 120,
          pricePerHour: 180,
          amenities: ["Projector", "WiFi"],
        },

        {
          venueId: center.id,
          name: "Auditorium A",
          capacityMin: 100,
          capacityMax: 500,
          pricePerHour: 300,
          amenities: ["Theater Seating", "Lighting Rig"],
        },
        {
          venueId: grands.id,
          name: "Auditorium A",
          capacityMin: 100,
          capacityMax: 500,
          pricePerHour: 300,
          amenities: ["Theater Seating", "Lighting Rig"],
        },
      ],
      { returning: true }
    );
    await Promise.all(halls.map((h) => h.reload())); // reload IDs in MySQL

    console.log("🏟️ Halls inserted");

    // Booking
    await Booking.create({
      venueId: grand.id,
      hallId: halls[0].id,
      customerName: "Sample Customer",
      customerPhone: "1234567890",
      customerEmail: "customer@example.com",
      eventDate: "2025-09-15",
      startTime: "10:00:00", // MySQL TIME expects HH:MM:SS
      endTime: "12:00:00",
      guestCount: 120,
      totalAmount: 500,
      status: "confirmed",
      userId: user.id,
    });

    console.log("📅 Booking inserted");

    console.log("[Seed] ✅ Done");
    await sequelize.close(); // ✅ safely close DB connection
  } catch (e) {
    console.error("❌ Seed error:", e);
    await sequelize.close();
    process.exit(1);
  }
}

seed();
