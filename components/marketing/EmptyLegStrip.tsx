"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/shared/LocaleProvider";
import { ArrowRight, Plane } from "lucide-react";
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
  aircraft: { model: string; tailNumber: string };
};

export function EmptyLegStrip() {
  const { t, locale } = useLocale();
  const [list, setList] = useState<EL[]>([]);
  useEffect(() => {
    fetch("/api/empty-legs")
      .then((r) => r.json())
      .then((d) => setList(d.emptyLegs ?? []));
  }, []);
  if (!list.length) return null;
  return (
    <section className="py-24 px-5 lg:px-8 bg-navy-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(50% 50% at 80% 20%, #C9A961, transparent 70%)" }} />
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[.25em] text-gold-300 font-semibold mb-3">EMPTY LEG</div>
            <h2 className="text-3xl md:text-5xl font-bold">{t("emptyLegs.title")}</h2>
            <p className="opacity-80 mt-3 max-w-xl">{t("emptyLegs.subtitle")}</p>
          </div>
          <Link href="/empty-legs" className="btn btn-outline-light">
            {t("common.viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {list.slice(0, 3).map((e) => (
            <Link
              key={e.id}
              href={`/empty-legs#${e.id}`}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur hover:bg-white/10 transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-xs uppercase tracking-wider opacity-80 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5" /> {e.aircraft.model}
                </div>
                <div className="pill bg-gold-400 text-navy-900">−{e.discountPct}%</div>
              </div>
              <div className="flex items-center text-2xl font-bold gap-3">
                {locale === "mn" ? e.fromLoc.name : e.fromLoc.nameEn}
                <ArrowRight className="w-5 h-5 text-gold-300" />
                {locale === "mn" ? e.toLoc.name : e.toLoc.nameEn}
              </div>
              <div className="text-sm opacity-80 mt-2">{t("emptyLegs.departing")}: {formatDate(e.departureTime, locale)}</div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-xs opacity-70 line-through">{formatUSD(Number(e.originalPrice))}</div>
                  <div className="text-3xl font-bold text-gold-300">{formatUSD(Number(e.discountedPrice))}</div>
                </div>
                <div className="btn btn-gold opacity-90 group-hover:opacity-100">
                  {t("emptyLegs.book")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
