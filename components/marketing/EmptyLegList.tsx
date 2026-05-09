"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/shared/LocaleProvider";
import { ArrowRight, Plane, Calendar } from "lucide-react";
import { formatUSD } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";

type EL = {
  id: string;
  fromLoc: { name: string; nameEn: string };
  toLoc: { name: string; nameEn: string };
  departureTime: string;
  originalPrice: string;
  discountedPrice: string;
  discountPct: number;
  aircraft: { id: string; model: string; tailNumber: string; capacity: number };
};

export function EmptyLegList() {
  const { t, locale } = useLocale();
  const [list, setList] = useState<EL[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/empty-legs")
      .then((r) => r.json())
      .then((d) => { setList(d.emptyLegs ?? []); setLoading(false); });
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 text-[rgb(var(--muted))]">{t("common.loading")}</div>;
  if (!list.length) return <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 text-[rgb(var(--muted))]">Одоогоор хоосон нислэг байхгүй.</div>;

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 space-y-4">
      {list.map((e) => (
        <article key={e.id} id={e.id} className="card p-6 grid lg:grid-cols-[1fr_auto_auto] gap-6 items-center hover:shadow-lg transition">
          <div>
            <div className="flex items-center text-xs uppercase tracking-wider text-[rgb(var(--muted))] gap-2">
              <Plane className="w-3.5 h-3.5 text-gold-500" /> {e.aircraft.model} · {e.aircraft.tailNumber} · {e.aircraft.capacity} зорчигч
            </div>
            <div className="flex items-center text-2xl md:text-3xl font-bold gap-3 mt-2">
              {locale === "mn" ? e.fromLoc.name : e.fromLoc.nameEn}
              <ArrowRight className="w-5 h-5 text-gold-500" />
              {locale === "mn" ? e.toLoc.name : e.toLoc.nameEn}
            </div>
            <div className="flex items-center text-sm text-[rgb(var(--muted))] mt-2 gap-1.5">
              <Calendar className="w-4 h-4" /> {formatDate(e.departureTime, locale)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-[rgb(var(--muted))]">{t("emptyLegs.originalPrice")}</div>
            <div className="text-sm line-through opacity-70">{formatUSD(Number(e.originalPrice))}</div>
            <div className="text-3xl font-bold text-gold-500">{formatUSD(Number(e.discountedPrice))}</div>
            <div className="pill bg-gold-100 text-gold-700 mt-1">−{e.discountPct}% {t("emptyLegs.save")}</div>
          </div>
          <Link href={`/booking/new?empty=${e.id}`} className="btn btn-primary lg:px-6">
            {t("emptyLegs.book")} <ArrowRight className="w-4 h-4" />
          </Link>
        </article>
      ))}
    </div>
  );
}
