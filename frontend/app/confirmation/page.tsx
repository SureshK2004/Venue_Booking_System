"use client"

import AuthGuard from "@/components/auth-guard"
import { useEffect, useState } from "react"

export default function ConfirmationPage() {
  return (
    <AuthGuard>
      <ConfirmationContent />
    </AuthGuard>
  )
}

function ConfirmationContent() {
  const [booking, setBooking] = useState<any | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastBooking")
      if (raw) setBooking(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 py-10">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 text-center">
          <h1 className="text-xl font-semibold text-green-600">Booking Confirmed</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your booking has been successfully created.</p>

          <div className="mt-6 text-left rounded-md border p-4">
            <h2 className="text-sm font-semibold">Booking Details</h2>
            {booking ? (
              <div className="mt-2 space-y-1 text-sm">
                {"id" in booking && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-medium">{String(booking.id)}</span>
                  </div>
                )}
                {"venueId" in booking && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="font-medium">{String(booking.venueId)}</span>
                  </div>
                )}
                {"date" in booking && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{booking.date}</span>
                  </div>
                )}
                {"time" in booking && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{booking.time}</span>
                  </div>
                )}
                {"duration" in booking && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{booking.duration}h</span>
                  </div>
                )}
                {"message" in booking && <p className="mt-2 text-sm">{booking.message}</p>}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No booking details found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
