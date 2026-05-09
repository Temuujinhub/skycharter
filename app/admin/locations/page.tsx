import { prisma } from "@/lib/db";
import { MapPin } from "lucide-react";
import { formatUSD } from "@/lib/pricing";

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Байршил болон хураамж</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-[rgb(var(--muted))] border-b border-[rgb(var(--border))]">
              <th className="px-5 py-3">Нэр</th>
              <th className="px-5 py-3">English</th>
              <th className="px-5 py-3">Төрөл</th>
              <th className="px-5 py-3">Бүс</th>
              <th className="px-5 py-3">Координат</th>
              <th className="px-5 py-3 text-right">Буудлын хураамж</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l) => (
              <tr key={l.id} className="border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--border)/.2)]">
                <td className="px-5 py-3 font-semibold flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gold-500" /> {l.name}</td>
                <td className="px-5 py-3 text-[rgb(var(--muted))]">{l.nameEn}</td>
                <td className="px-5 py-3"><span className="pill pill-active">{l.type}</span></td>
                <td className="px-5 py-3 text-[rgb(var(--muted))]">{l.region ?? "—"}</td>
                <td className="px-5 py-3 text-xs text-[rgb(var(--muted))]">{l.lat.toFixed(3)}, {l.lng.toFixed(3)}</td>
                <td className="px-5 py-3 text-right font-bold text-gold-600">{formatUSD(Number(l.landingFee))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
