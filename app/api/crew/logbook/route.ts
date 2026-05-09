import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  bookingId: z.string(),
  engineStartAt: z.string().optional().nullable(),
  takeoffAt: z.string().optional().nullable(),
  landingAt: z.string().optional().nullable(),
  engineStopAt: z.string().optional().nullable(),
  fuelUsedLiters: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "PILOT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { bookingId, engineStartAt, takeoffAt, landingAt, engineStopAt, fuelUsedLiters, notes } = parsed.data;

  const data = {
    pilotId: session.user.id,
    engineStartAt: engineStartAt ? new Date(engineStartAt) : null,
    takeoffAt: takeoffAt ? new Date(takeoffAt) : null,
    landingAt: landingAt ? new Date(landingAt) : null,
    engineStopAt: engineStopAt ? new Date(engineStopAt) : null,
    fuelUsedLiters: fuelUsedLiters ?? null,
    notes: notes ?? null,
  };

  const log = await prisma.flightLog.upsert({
    where: { bookingId },
    update: data,
    create: { bookingId, ...data },
  });

  // Auto-mark completed if landing recorded
  if (landingAt) {
    await prisma.booking.update({ where: { id: bookingId }, data: { status: "COMPLETED" } });
  }

  return NextResponse.json({ log });
}
