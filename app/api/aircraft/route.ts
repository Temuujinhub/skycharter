import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const aircraft = await prisma.aircraft.findMany({
    where: { status: { not: "INACTIVE" } },
    orderBy: { hourlyRate: "asc" },
  });
  return NextResponse.json({ aircraft });
}
