import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { calculateQuote } from "@/lib/pricing";
import { generateBookingCode } from "@/lib/utils";

const createSchema = z.object({
  fromLocId: z.string(),
  toLocId: z.string(),
  aircraftId: z.string(),
  departureTime: z.string(),
  pax: z.number().int().min(1).max(20),
  passengers: z.array(z.object({
    fullName: z.string().min(1),
    document: z.string().optional(),
    weightKg: z.number().optional(),
  })).min(1),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  notes: z.string().optional(),
  emptyLegId: z.string().optional(),
  paymentMethod: z.enum(["QPAY", "CARD", "SOCIALPAY", "INVOICE"]),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;

  const [from, to, aircraft] = await Promise.all([
    prisma.location.findUnique({ where: { id: data.fromLocId } }),
    prisma.location.findUnique({ where: { id: data.toLocId } }),
    prisma.aircraft.findUnique({ where: { id: data.aircraftId } }),
  ]);
  if (!from || !to || !aircraft) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let emptyLegDiscountPct = 0;
  let emptyLegId: string | undefined;
  if (data.emptyLegId) {
    const el = await prisma.emptyLeg.findUnique({ where: { id: data.emptyLegId } });
    if (el && el.status === "AVAILABLE") {
      emptyLegDiscountPct = el.discountPct;
      emptyLegId = el.id;
    }
  }

  const q = calculateQuote({
    from: { lat: from.lat, lng: from.lng, landingFee: Number(from.landingFee) },
    to: { lat: to.lat, lng: to.lng, landingFee: Number(to.landingFee) },
    aircraft: { hourlyRate: Number(aircraft.hourlyRate), cruiseSpeed: aircraft.cruiseSpeed },
    emptyLegDiscountPct,
  });

  const booking = await prisma.booking.create({
    data: {
      bookingCode: generateBookingCode(),
      userId: session?.user?.id,
      guestEmail: !session?.user ? data.guestEmail : undefined,
      guestName: !session?.user ? data.guestName : undefined,
      guestPhone: !session?.user ? data.guestPhone : undefined,
      aircraftId: aircraft.id,
      departureLocId: from.id,
      arrivalLocId: to.id,
      departureTime: new Date(data.departureTime),
      paxCount: data.pax,
      estFlightMinutes: q.flightMinutes,
      distanceKm: q.distanceKm,
      basePrice: q.basePrice,
      fees: q.fees,
      totalPrice: q.total,
      status: "PENDING",
      notes: data.notes,
      isEmptyLeg: !!emptyLegId,
      emptyLegId,
      passengers: { create: data.passengers },
    },
    include: { passengers: true, aircraft: true, departureLoc: true, arrivalLoc: true },
  });

  if (emptyLegId) {
    await prisma.emptyLeg.update({ where: { id: emptyLegId }, data: { status: "BOOKED" } });
  }

  return NextResponse.json({ booking });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ bookings: [] });
  const where = session.user.role === "ADMIN"
    ? {}
    : { userId: session.user.id };
  const bookings = await prisma.booking.findMany({
    where,
    include: { aircraft: true, departureLoc: true, arrivalLoc: true, payment: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}
