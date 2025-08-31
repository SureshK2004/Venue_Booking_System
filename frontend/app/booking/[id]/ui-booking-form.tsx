"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authHeader } from "@/lib/auth"
import { type BookingPayload, type BookingResponse, postJSON } from "@/lib/api"

export default function BookingForm({ venueId }: { venueId: string }) {
  const router = useRouter()
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload: BookingPayload = {
        venueId,
        date,
        time,
        duration: Number(duration),
      }
      const data = await postJSON<BookingResponse>("/api/bookings", payload, {
        headers: {
          ...authHeader(),
        },
      })
      // Persist booking details for confirmation page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lastBooking", JSON.stringify(data))
      }
      router.push("/confirmation")
    } catch (err: any) {
      setError(err?.message || "Booking failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Time</label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration (hours)</label>
          <input
            type="number"
            min={1}
            required
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  )
}
