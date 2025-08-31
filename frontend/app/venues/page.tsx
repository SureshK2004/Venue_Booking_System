import Navbar from "@/components/navbar"
import VenueCard, { type Venue } from "@/components/venue-card"
import { getBaseUrl } from "@/lib/api"

async function getVenues(): Promise<Venue[]> {
  const base = getBaseUrl()
  const res = await fetch(`${base}/venues`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export default async function VenuesPage() {
  const venues = await getVenues()

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 text-balance">Browse Venues</h1>
          <p className="text-sm text-gray-600">
            Explore spaces and book your next event. Primary brand color: blue-600.
          </p>
        </div>
        {venues.length === 0 ? (
          <p className="text-gray-600">No venues found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
