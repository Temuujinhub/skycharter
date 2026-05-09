import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { calculateQuote } from "@/lib/pricing";

const schema = z.object({
  fromLocId: z.string(),
  toLocId: z.string(),
  aircraftId: z.string().optional(),
  pax: z.number().int().min(1).max(20).default(1),
  emptyLegId: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { fromLocId, toLocId, aircraftId, pax, emptyLegId } = parsed.data;

  if (fromLocId === toLocId) {
    return NextResponse.json({ error: "from and to must differ" }, { status: 400 });
  }

  const [from, to] = await Promise.all([
    prisma.location.findUnique({ where: { id: fromLocId } }),
    prisma.location.findUnique({ where: { id: toLocId } }),
  ]);
  if (!from || !to) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  let candidates = await prisma.aircraft.findMany({
    where: { status: "ACTIVE", capacity: { gte: pax } },
  });
  if (aircraftId) candidates = candidates.filter((a) => a.id === aircraftId);

  let emptyLegDiscountPct = 0;
  if (emptyLegId) {
    const el = await prisma.emptyLeg.findUnique({ where: { id: emptyLegId } });
    if (el) emptyLegDiscountPct = el.discountPct;
  }

  const quotes = candidates.map((a) => {
    const q = calculateQuote({
      from: { lat: from.lat, lng: from.lng, landingFee: Number(from.landingFee) },
      to: { lat: to.lat, lng: to.lng, landingFee: Number(to.landingFee) },
      aircraft: { hourlyRate: Number(a.hourlyRate), cruiseSpeed: a.cruiseSpeed },
      emptyLegDiscountPct,
    });
    return { aircraft: a, quote: q };
  });

  return NextResponse.json({ from, to, quotes });
}
