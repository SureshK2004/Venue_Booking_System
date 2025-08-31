import VenueCard from "@/components/venue-card"
import { getJSON, type Venue } from "@/lib/api"

export const revalidate = 0

async function fetchVenues(): Promise<Venue[]> {
  // GET /api/venues
  return await getJSON<Venue[]>("/api/venues")
}

export default async function HomePage() {
  let venues: Venue[] = []
  try {
    venues = await fetchVenues()
  } catch (e: any) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-semibold">Venues</h1>
        <p className="mt-4 text-sm text-red-600">Failed to load venues: {e?.message || "Unknown error"}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold">Venues</h1>

      {venues.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No venues available.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <VenueCard key={String(v.id)} venue={v} />
          ))}
        </div>
      )}
    </main>
  )
}
