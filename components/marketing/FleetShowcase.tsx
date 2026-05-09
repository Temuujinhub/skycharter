"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/shared/LocaleProvider";
import { ArrowRight, Gauge, Package, Plane, Users } from "lucide-react";
import { formatUSD } from "@/lib/pricing";

type Aircraft = {
  id: string;
  tailNumber: string;
  model: string;
  capacity: number;
  hourlyRate: string | number;
  cruiseSpeed: number;
  rangeKm: number;
  cargoKg: number;
  imageUrl: string | null;
  description: string | null;
  descriptionEn: string | null;
};

export function FleetShowcase() {
  const { t, locale } = useLocale();
  const [list, setList] = useState<Aircraft[]>([]);

  useEffect(() => {
    fetch("/api/aircraft")
      .then((r) => r.json())
      .then((d) => setList(d.aircraft ?? []));
  }, []);

  return (
    <section className="py-24 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[.25em] text-gold-500 font-semibold mb-3">FLEET</div>
            <h2 className="text-3xl md:text-5xl font-bold">{t("fleet.title")}</h2>
            <p className="text-[rgb(var(--muted))] mt-3 max-w-xl">{t("fleet.subtitle")}</p>
          </div>
          <Link href="/fleet" className="btn btn-ghost">
            {t("common.viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {list.map((a) => (
            <article key={a.id} className="card overflow-hidden group hover:shadow-xl transition">
              <div
                className="aspect-[16/10] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${a.imageUrl ?? "https://images.unsplash.com/photo-1583500178690-f7eb09e7c5b7?auto=format&fit=crop&w=1200&q=80"})` }}
              >
                <div className="absolute top-4 left-4 pill pill-active">{a.tailNumber}</div>
                <div className="absolute bottom-4 right-4 text-white text-right">
                  <div className="text-3xl font-bold">{formatUSD(Number(a.hourlyRate))}<span className="text-sm font-normal opacity-80">{t("fleet.perHour")}</span></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2"><Plane className="w-5 h-5 text-gold-500" /> {a.model}</h3>
                  <p className="text-[rgb(var(--muted))] text-sm mt-1">{locale === "mn" ? a.description : a.descriptionEn}</p>
                </div>
                <div className="grid grid-cols-4 gap-3 pt-2">
                  <Spec icon={<Users className="w-4 h-4" />} label={t("fleet.capacity")} value={`${a.capacity}`} />
                  <Spec icon={<Gauge className="w-4 h-4" />} label={t("fleet.speed")} value={`${a.cruiseSpeed}`} hint={t("fleet.kmh")} />
                  <Spec icon={<ArrowRight className="w-4 h-4" />} label={t("fleet.range")} value={`${a.rangeKm}`} hint={t("fleet.km")} />
                  <Spec icon={<Package className="w-4 h-4" />} label={t("fleet.cargo")} value={`${a.cargoKg}`} hint={t("fleet.kg")} />
                </div>
                <Link href={`/search?aircraft=${a.id}`} className="btn btn-primary w-full mt-2">
                  {t("fleet.select")} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
          {list.length === 0 && Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card aspect-[16/12] animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Spec({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="text-center">
      <div className="w-9 h-9 mx-auto rounded-lg bg-navy-50 dark:bg-navy-800/50 grid place-items-center text-gold-500">{icon}</div>
      <div className="text-xs text-[rgb(var(--muted))] mt-1.5 uppercase tracking-wider">{label}</div>
      <div className="font-bold text-sm">{value}{hint && <span className="font-normal text-[rgb(var(--muted))] text-xs ml-0.5">{hint}</span>}</div>
    </div>
  );
}
