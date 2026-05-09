import { prisma } from "@/lib/db";
import { ArrowRight, Sparkles } from "lucide-react";
import { formatUSD } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";

export default async function AdminEmptyLegsPage() {
  const legs = await prisma.emptyLeg.findMany({
    include: { fromLoc: true, toLoc: true, aircraft: true },
    orderBy: { departureTime: "asc" },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3"><Sparkles className="w-6 h-6 text-gold-500" /> Хоосон нислэгүүд</h1>
      <div className="grid lg:grid-cols-2 gap-4">
        {legs.map((e) => (
          <div key={e.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-[rgb(var(--muted))]">{e.aircraft.model} · {e.aircraft.tailNumber}</div>
              <span className={`pill pill-${e.status.toLowerCase()}`}>{e.status}</span>
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold mt-3">
              {e.fromLoc.name}
              <ArrowRight className="w-4 h-4 text-gold-500" />
              {e.toLoc.name}
            </div>
            <div className="text-xs text-[rgb(var(--muted))] mt-1.5">{formatDate(e.departureTime.toISOString(), "mn")}</div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <div className="text-xs text-[rgb(var(--muted))] line-through">{formatUSD(Number(e.originalPrice))}</div>
                <div className="text-xl font-bold text-gold-600">{formatUSD(Number(e.discountedPrice))}</div>
              </div>
              <div className="pill bg-gold-100 text-gold-700">−{e.discountPct}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
