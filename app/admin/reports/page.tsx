import { prisma } from "@/lib/db";
import { formatUSD } from "@/lib/pricing";
import { RevenueChart } from "../RevenueChart";

export default async function AdminReportsPage() {
  const [payments, routeStats, aircraftStats] = await Promise.all([
    prisma.payment.findMany({ where: { status: "PAID" }, select: { amount: true, paidAt: true } }),
    prisma.booking.groupBy({
      by: ["departureLocId", "arrivalLocId"],
      _count: { _all: true },
      _sum: { totalPrice: true },
    }),
    prisma.booking.groupBy({
      by: ["aircraftId"],
      _count: { _all: true },
      _sum: { estFlightMinutes: true },
    }),
  ]);

  const monthly = new Map<string, number>();
  payments.forEach((p) => {
    const d = p.paidAt ?? new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthly.set(key, (monthly.get(key) ?? 0) + Number(p.amount));
  });
  const chartData = Array.from(monthly.entries()).sort().map(([month, revenue]) => ({ month, revenue }));

  // Resolve names for routes / aircraft
  const [locs, aircraft] = await Promise.all([
    prisma.location.findMany(),
    prisma.aircraft.findMany(),
  ]);
  const locMap = new Map(locs.map((l) => [l.id, l.name]));
  const acMap = new Map(aircraft.map((a) => [a.id, a.model]));

  const topRoutes = routeStats
    .map((r) => ({ from: locMap.get(r.departureLocId) ?? "?", to: locMap.get(r.arrivalLocId) ?? "?", count: r._count._all, revenue: Number(r._sum.totalPrice ?? 0) }))
    .sort((a, b) => b.count - a.count).slice(0, 8);

  const utilization = aircraftStats.map((a) => ({
    model: acMap.get(a.aircraftId) ?? "?",
    flights: a._count._all,
    hours: Math.round(((a._sum.estFlightMinutes ?? 0) / 60) * 10) / 10,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Тайлан, аналитик</h1>

      <div className="card p-6">
        <h3 className="font-bold mb-4">Сарын орлого</h3>
        <RevenueChart data={chartData} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold mb-4">Хамгийн их захиалагдсан чиглэлүүд</h3>
          <ul className="space-y-2 text-sm">
            {topRoutes.map((r, i) => (
              <li key={i} className="flex items-center justify-between border-b border-[rgb(var(--border))] py-2">
                <span>{r.from} → {r.to}</span>
                <span className="text-[rgb(var(--muted))]">{r.count} нислэг · <span className="text-gold-600 font-bold">{formatUSD(r.revenue)}</span></span>
              </li>
            ))}
            {topRoutes.length === 0 && <li className="text-[rgb(var(--muted))] text-xs">Өгөгдөл алга</li>}
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-4">Паркын ашиглалт</h3>
          <ul className="space-y-2 text-sm">
            {utilization.map((u, i) => (
              <li key={i} className="flex items-center justify-between border-b border-[rgb(var(--border))] py-2">
                <span>{u.model}</span>
                <span className="text-[rgb(var(--muted))]">{u.flights} нислэг · <span className="font-semibold">{u.hours} цаг</span></span>
              </li>
            ))}
            {utilization.length === 0 && <li className="text-[rgb(var(--muted))] text-xs">Өгөгдөл алга</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
