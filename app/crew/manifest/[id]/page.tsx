import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, MapPin, Plane, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { formatMinutes } from "@/lib/pricing";
import { LogbookForm } from "../../LogbookForm";

export default async function ManifestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await prisma.booking.findUnique({
    where: { id },
    include: { aircraft: true, departureLoc: true, arrivalLoc: true, passengers: true, flightLog: true },
  });
  if (!b) notFound();

  const totalWeight = b.passengers.reduce((s, p) => s + (p.weightKg ?? 0), 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="rounded-xl bg-white/5 border border-white/10 p-6">
        <div className="text-xs uppercase tracking-wider opacity-70">{b.bookingCode}</div>
        <div className="text-3xl font-bold mt-1 flex items-center gap-3">
          {b.departureLoc.name}
          <ArrowRight className="w-6 h-6 text-gold-400" />
          {b.arrivalLoc.name}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gold-400" /> {formatDate(b.departureTime.toISOString(), "mn")}</div>
          <div className="flex items-center gap-2"><Plane className="w-4 h-4 text-gold-400" /> {b.aircraft.model} ({b.aircraft.tailNumber})</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400" /> {b.distanceKm} км · {formatMinutes(b.estFlightMinutes)}</div>
          <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gold-400" /> {b.paxCount} зорчигч · {totalWeight} кг</div>
        </div>
      </div>

      <div className="rounded-xl bg-white/5 border border-white/10 p-6">
        <h3 className="font-bold mb-3">Зорчигчдын жагсаалт</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider opacity-60 border-b border-white/10">
              <th className="py-2">№</th>
              <th className="py-2">Нэр</th>
              <th className="py-2">Бичиг баримт</th>
              <th className="py-2 text-right">Жин</th>
            </tr>
          </thead>
          <tbody>
            {b.passengers.map((p, i) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="py-2.5">{i + 1}</td>
                <td className="py-2.5 font-semibold">{p.fullName}</td>
                <td className="py-2.5 opacity-70">{p.document ?? "—"}</td>
                <td className="py-2.5 text-right">{p.weightKg ?? "—"} кг</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LogbookForm bookingId={b.id} existing={b.flightLog ? {
        engineStartAt: b.flightLog.engineStartAt?.toISOString() ?? null,
        takeoffAt: b.flightLog.takeoffAt?.toISOString() ?? null,
        landingAt: b.flightLog.landingAt?.toISOString() ?? null,
        engineStopAt: b.flightLog.engineStopAt?.toISOString() ?? null,
        fuelUsedLiters: b.flightLog.fuelUsedLiters ?? null,
        notes: b.flightLog.notes ?? null,
      } : null} />
    </div>
  );
}
