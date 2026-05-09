import { prisma } from "@/lib/db";
import Link from "next/link";
import { CalendarRange, Plane, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { formatUSD } from "@/lib/pricing";
import { RevenueChart } from "./RevenueChart";

export default async function AdminHome() {
  const [
    totalRevenue,
    activeBookings,
    totalFlights,
    fleetCount,
    recent,
    paymentsByMonth,
  ] = await Promise.all([
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.booking.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.booking.count(),
    prisma.aircraft.count({ where: { status: "ACTIVE" } }),
    prisma.booking.findMany({
      take: 5, orderBy: { createdAt: "desc" },
      include: { aircraft: true, departureLoc: true, arrivalLoc: true, user: true },
    }),
    prisma.payment.findMany({ where: { status: "PAID" }, select: { amount: true, paidAt: true } }),
  ]);

  // group revenue by month
  const monthly = new Map<string, number>();
  paymentsByMonth.forEach((p) => {
    const d = p.paidAt ?? new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthly.set(key, (monthly.get(key) ?? 0) + Number(p.amount));
  });
  const chartData = Array.from(monthly.entries()).sort().map(([month, revenue]) => ({ month, revenue }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Удирдлагын самбар</h1>
        <p className="text-sm text-[rgb(var(--muted))]">Sky Charter Mongolia — өнөөдрийн үзүүлэлтүүд</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPI icon={<DollarSign className="w-5 h-5" />} label="Нийт орлого" value={formatUSD(Number(totalRevenue._sum.amount ?? 0))} />
        <KPI icon={<CalendarRange className="w-5 h-5" />} label="Идэвхтэй захиалга" value={String(activeBookings)} />
        <KPI icon={<TrendingUp className="w-5 h-5" />} label="Нийт нислэг" value={String(totalFlights)} />
        <KPI icon={<Plane className="w-5 h-5" />} label="Идэвхтэй онгоц" value={String(fleetCount)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold mb-4">Сарын орлого</h3>
          <RevenueChart data={chartData} />
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Сүүлийн захиалгууд</h3>
            <Link href="/admin/bookings" className="text-xs text-gold-500 font-semibold hover:underline">Бүгд <ArrowRight className="inline w-3 h-3" /></Link>
          </div>
          <ul className="space-y-3 text-sm">
            {recent.map((b) => (
              <li key={b.id}>
                <Link href={`/booking/${b.id}`} className="block hover:bg-[rgb(var(--border)/.3)] p-2 -mx-2 rounded">
                  <div className="font-semibold">{b.bookingCode}</div>
                  <div className="text-xs text-[rgb(var(--muted))]">{b.departureLoc.name} → {b.arrivalLoc.name}</div>
                  <div className="text-xs text-gold-600 font-semibold">{formatUSD(Number(b.totalPrice))}</div>
                </Link>
              </li>
            ))}
            {recent.length === 0 && <li className="text-[rgb(var(--muted))] text-xs">Захиалга байхгүй</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-navy-800 text-gold-400 grid place-items-center">{icon}</div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[rgb(var(--muted))]">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}
