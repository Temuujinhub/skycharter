import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const emptyLegs = await prisma.emptyLeg.findMany({
    where: { status: "AVAILABLE", departureTime: { gte: new Date() } },
    include: { fromLoc: true, toLoc: true, aircraft: true },
    orderBy: { departureTime: "asc" },
  });
  return NextResponse.json({ emptyLegs });
}
