import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { formatMinutes } from "@/lib/pricing";

export default async function CrewHome() {
  const upcoming = await prisma.booking.findMany({
    where: { status: { in: ["CONFIRMED", "PENDING"] } },
    include: { aircraft: true, departureLoc: true, arrivalLoc: true, passengers: true },
    orderBy: { departureTime: "asc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Өнөөдрийн нислэгүүд</h1>
        <p className="text-sm opacity-70">Захиалга бүрийн мэдээлэл, зорчигчийн жагсаалт.</p>
      </div>
      <div className="space-y-3">
        {upcoming.map((b) => {
          const totalWeight = b.passengers.reduce((s, p) => s + (p.weightKg ?? 0), 0);
          return (
            <Link key={b.id} href={`/crew/manifest/${b.id}`} className="block rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10 p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-70">{b.bookingCode} · {b.aircraft.model} · {b.aircraft.tailNumber}</div>
                  <div className="text-2xl font-bold mt-1 flex items-center gap-3">
                    {b.departureLoc.name}
                    <ArrowRight className="w-5 h-5 text-gold-400" />
                    {b.arrivalLoc.name}
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-80 mt-2">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(b.departureTime.toISOString(), "mn")}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {b.distanceKm} км · {formatMinutes(b.estFlightMinutes)}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {b.paxCount} зорчигч ({totalWeight} кг)</span>
                  </div>
                </div>
                <span className={`pill pill-${b.status.toLowerCase()}`}>{b.status}</span>
              </div>
            </Link>
          );
        })}
        {upcoming.length === 0 && <div className="text-sm opacity-70">Удахгүйн нислэг алга</div>}
      </div>
    </div>
  );
}
