"use client"
import useSWR from "swr"
import { privateGet } from "@/lib/api"

type Booking = {
  id: string | number
  venueId: string | number
  venueName?: string
  date?: string
  startTime?: string
  endTime?: string
  guests?: number
  notes?: string
  status?: string
  totalPrice?: number
}

const bookingFetcher = (path: string) => privateGet<Booking>(path)

function useBooking(id: string) {
  return useSWR<Booking>(id ? `/api/bookings/${id}` : null, bookingFetcher)
}


export default function BookingConfirmPage({ params }: { params: { bookingId: string } }) {
  const { data, error, isLoading } = useBooking(params.bookingId)

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold">Booking details</h1>
      {isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="mt-4 text-sm text-red-600">Failed to load booking.</p>
      ) : !data ? (
        <p className="mt-4 text-sm text-muted-foreground">Booking not found.</p>
      ) : (
        <div className="mt-6 rounded-lg border bg-card p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Info label="Booking ID" value={String(data.id)} />
            <Info label="Venue" value={data.venueName || String(data.venueId)} />
            <Info label="Date" value={data.date} />
            <Info label="Time" value={data.startTime && data.endTime ? `${data.startTime} - ${data.endTime}` : "—"} />
            <Info label="Guests" value={typeof data.guests === "number" ? String(data.guests) : "—"} />
            <Info label="Status" value={data.status || "confirmed"} />
            <Info label="Notes" value={data.notes || "—"} className="md:col-span-2" />
            <Info
              label="Total price"
              value={typeof data.totalPrice === "number" ? `$${data.totalPrice}` : "—"}
              className="md:col-span-2"
            />
          </div>

          <a
            href="/"
            className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
          >
            Back to venues
          </a>
        </div>
      )}
    </main>
  )
}

function Info(props: { label: string; value?: string; className?: string }) {
  return (
    <div className={props.className}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{props.label}</div>
      <div className="text-sm">{props.value || "—"}</div>
    </div>
  )
}
