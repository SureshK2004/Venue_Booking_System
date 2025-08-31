"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import AuthGuard from "@/components/auth-guard"
import { privatePost } from "@/lib/api"

type BookingResponse = { id: string | number }

export default function BookVenuePage({ params }: { params: { venueId: string } }) {
  const router = useRouter()
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [guests, setGuests] = useState<number>(1)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = { venueId: params.venueId, date, startTime, endTime, guests, notes }
      const data = await privatePost<BookingResponse>("/api/bookings", payload)
      router.replace(`/bookings/${data.id}`)
    } catch (err: any) {
      setError(err?.message || "Booking failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <main className="mx-auto max-w-xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-semibold">Book venue</h1>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 rounded-lg border bg-card p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span>Date</span>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Guests</span>
              <input
                type="number"
                min={1}
                required
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value || 1))}
                className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span>Start time</span>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>End time</span>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span>Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[88px] rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              placeholder="Anything the venue should know?"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
          >
            {loading ? "Submitting..." : "Confirm booking"}
          </button>
        </form>
      </main>
    </AuthGuard>
  )
}
