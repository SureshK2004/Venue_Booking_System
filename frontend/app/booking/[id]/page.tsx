import AuthGuard from "@/components/auth-guard"
import BookingForm from "./ui-booking-form"

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <AuthGuard>
      <main className="mx-auto max-w-md px-4 sm:px-6 py-10">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-center">Book Venue</h1>
            <BookingForm venueId={id} />
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
