import Image from "next/image"
import Link from "next/link"
import { getJSON, type Venue } from "@/lib/api"
import { cn } from "@/lib/utils"

export const revalidate = 0

async function fetchVenue(id: string): Promise<Venue> {
  return await getJSON<Venue>(`/api/venues/${id}`)
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // ✅ Await params because in App Router it can be async
  const { id } = await params
  const venue = await fetchVenue(id)

  // ✅ Pick images safely
  const images =
    venue.images && venue.images.length > 0
      ? venue.images
      : ([venue.image].filter(Boolean) as string[])

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex flex-col gap-6">
        {/* Title + Address */}
        <div>
          <h1 className="text-2xl font-semibold text-pretty">{venue.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{venue.address}</p>
        </div>

        {/* Image Gallery */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[16/9] overflow-hidden rounded-md border"
              >
                <Image
                  src={
                    src ||
                    "/placeholder.svg?height=300&width=540&query=venue"
                  }
                  alt={`Image ${i + 1} of ${venue.name}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative aspect-[16/9] overflow-hidden rounded-md border">
            <Image
              src="/elegant-wedding-venue.png"
              alt="Venue image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* About + Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* About Section */}
          <div className="md:col-span-2 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">About this venue</h2>
            <p className="mt-2 text-sm text-pretty">
              {venue.description || "No description provided."}
            </p>
          </div>

          {/* Sidebar (Capacity + Price + Booking) */}
          <div className="rounded-lg border p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">{venue.capacity ?? "-"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {venue.priceRangeMin != null
                    ? `$${venue.priceRangeMin}${
                        venue.priceRangeMax
                          ? " - $" + venue.priceRangeMax
                          : ""
                      }`
                    : "-"}
                </span>
              </div>
            </div>

            <Link
              href={`/booking/${venue.id}`}
              className={cn(
                "mt-4 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              )}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
