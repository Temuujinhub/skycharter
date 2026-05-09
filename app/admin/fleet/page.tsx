import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Plane, Wrench } from "lucide-react";
import { formatUSD } from "@/lib/pricing";

export default async function AdminFleetPage() {
  const aircraft = await prisma.aircraft.findMany({
    include: { maintenance: { orderBy: { scheduledAt: "desc" }, take: 5 } },
    orderBy: { tailNumber: "asc" },
  });
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Парк удирдлага</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        {aircraft.map((a) => (
          <div key={a.id} className="card overflow-hidden">
            <div
              className="aspect-[16/8] bg-cover bg-center"
              style={{ backgroundImage: `url(${a.imageUrl ?? "https://images.unsplash.com/photo-1583500178690-f7eb09e7c5b7?auto=format&fit=crop&w=900&q=80"})` }}
            />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-xl flex items-center gap-2"><Plane className="w-4 h-4 text-gold-500" /> {a.model}</h3>
                  <div className="text-xs text-[rgb(var(--muted))]">{a.tailNumber}</div>
                </div>
                <span className={`pill pill-${a.status.toLowerCase()}`}>{a.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-4">
                <Stat label="Багтаамж" value={`${a.capacity}`} />
                <Stat label="Цагийн хөлс" value={formatUSD(Number(a.hourlyRate))} />
                <Stat label="Хурд" value={`${a.cruiseSpeed} км/ц`} />
              </div>
              <div className="mt-5">
                <h4 className="text-xs uppercase tracking-wider text-[rgb(var(--muted))] font-semibold mb-2 flex items-center gap-1.5"><Wrench className="w-3 h-3" /> Засвар үйлчилгээ</h4>
                {a.maintenance.length === 0 ? (
                  <div className="text-xs text-[rgb(var(--muted))]">Бүртгэл алга</div>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {a.maintenance.map((m) => (
                      <li key={m.id} className="flex items-center justify-between border border-[rgb(var(--border))] rounded px-2.5 py-1.5">
                        <span>{m.type}</span>
                        <span className="text-[rgb(var(--muted))]">{new Date(m.scheduledAt).toLocaleDateString("mn-MN")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[rgb(var(--border)/.3)] p-2">
      <div className="text-[10px] uppercase tracking-wider text-[rgb(var(--muted))]">{label}</div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}
