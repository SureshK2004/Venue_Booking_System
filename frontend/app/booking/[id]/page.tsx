import AuthGuard from "@/components/auth-guard"
import BookingForm from "./ui-booking-form"

export default function BookingPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <main className="mx-auto max-w-md px-4 sm:px-6 py-10">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-center">Book Venue</h1>
            <BookingForm venueId={params.id} />
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
