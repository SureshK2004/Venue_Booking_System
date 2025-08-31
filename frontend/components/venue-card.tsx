import Link from "next/link"
import Image from "next/image"
import type { Venue } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function VenueCard({ venue }: { venue: Venue }) {
  const imageSrc = (venue.images && venue.images[0]) || venue.image || "/elegant-wedding-venue.png"
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="relative aspect-[16/9]">
        <Image
          src={imageSrc || "/placeholder.svg?height=180&width=320&query=venue"}
          alt={`${venue.name} image`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-pretty">{venue.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{venue.address}</p>
        <div className="mt-4">
          <Link
            href={`/venues/${venue.id}`}
            className={cn(
              "inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
