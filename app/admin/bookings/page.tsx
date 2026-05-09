import { prisma } from "@/lib/db";
import { BookingsTable } from "./BookingsTable";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { aircraft: true, departureLoc: true, arrivalLoc: true, user: true, payment: true },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Захиалгууд</h1>
      <BookingsTable bookings={JSON.parse(JSON.stringify(bookings))} />
    </div>
  );
}
