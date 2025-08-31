import { Venue } from "./Venue.js"
import { Hall } from "./Hall.js"
import { Booking } from "./Booking.js"
import { User } from "./User.js"

Venue.hasMany(Hall, { foreignKey: "venueId", as: "halls", onDelete: "CASCADE" })
Hall.belongsTo(Venue, { foreignKey: "venueId", as: "venue" })

Venue.hasMany(Booking, { foreignKey: "venueId", as: "bookings", onDelete: "CASCADE" })
Hall.hasMany(Booking, { foreignKey: "hallId", as: "bookings", onDelete: "CASCADE" })
Booking.belongsTo(Venue, { foreignKey: "venueId", as: "venue" })
Booking.belongsTo(Hall, { foreignKey: "hallId", as: "hall" })

User.hasMany(Booking, { foreignKey: "userId", as: "userBookings" })
Booking.belongsTo(User, { foreignKey: "userId", as: "user" })

export { Venue, Hall, Booking, User }
