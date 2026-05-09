import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { formatMinutes } from "@/lib/pricing";

export default async function LogbookListPage() {
  const logs = await prisma.flightLog.findMany({
    include: { booking: { include: { aircraft: true, departureLoc: true, arrivalLoc: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Нислэгийн бүртгэлүүд</h1>
      <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider opacity-60 border-b border-white/10">
              <th className="px-5 py-3">Захиалга</th>
              <th className="px-5 py-3">Чиглэл</th>
              <th className="px-5 py-3">Онгоц</th>
              <th className="px-5 py-3">Хөөрсөн</th>
              <th className="px-5 py-3">Буусан</th>
              <th className="px-5 py-3">Шатахуун</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-5 py-3 font-semibold">
                  <Link href={`/crew/manifest/${l.bookingId}`}>{l.booking.bookingCode}</Link>
                </td>
                <td className="px-5 py-3">{l.booking.departureLoc.name} → {l.booking.arrivalLoc.name}</td>
                <td className="px-5 py-3 opacity-70">{l.booking.aircraft.tailNumber}</td>
                <td className="px-5 py-3 text-xs opacity-70">{l.takeoffAt ? formatDate(l.takeoffAt.toISOString(), "mn") : "—"}</td>
                <td className="px-5 py-3 text-xs opacity-70">{l.landingAt ? formatDate(l.landingAt.toISOString(), "mn") : "—"}</td>
                <td className="px-5 py-3">{l.fuelUsedLiters ?? "—"} л</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center opacity-60">Бүртгэл алга</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
