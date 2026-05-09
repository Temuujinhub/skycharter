"use client";

import { useLocale } from "@/components/shared/LocaleProvider";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const ROUTES = [
  { from: "Улаанбаатар", fromEn: "Ulaanbaatar", to: "Хөвсгөл", toEn: "Khuvsgul", img: "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=80", price: "$3,200", popular: true },
  { from: "Улаанбаатар", fromEn: "Ulaanbaatar", to: "Хонгорын элс", toEn: "Khongoryn Els", img: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=900&q=80", price: "$5,400", popular: true },
  { from: "Улаанбаатар", fromEn: "Ulaanbaatar", to: "Алтай таван богд", toEn: "Altai Tavan Bogd", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80", price: "$7,800" },
  { from: "Улаанбаатар", fromEn: "Ulaanbaatar", to: "Оюу Толгой", toEn: "Oyu Tolgoi", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80", price: "$4,800" },
  { from: "Улаанбаатар", fromEn: "Ulaanbaatar", to: "Хархорин", toEn: "Kharkhorin", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80", price: "$2,400" },
  { from: "Улаанбаатар", fromEn: "Ulaanbaatar", to: "Ховд", toEn: "Khovd", img: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=900&q=80", price: "$6,100" },
];

export function PopularRoutes() {
  const { t, locale } = useLocale();
  return (
    <section className="py-24 px-5 lg:px-8 bg-navy-50/50 dark:bg-navy-950/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-[.25em] text-gold-500 font-semibold mb-3">DESTINATIONS</div>
          <h2 className="text-3xl md:text-5xl font-bold">{t("routes.title")}</h2>
          <p className="text-[rgb(var(--muted))] mt-3 max-w-xl mx-auto">{t("routes.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROUTES.map((r, i) => (
            <Link
              key={i}
              href="/search"
              className="group relative h-72 rounded-2xl overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${r.img})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
              {r.popular && (
                <div className="absolute top-4 right-4 pill bg-gold-400 text-navy-900">{t("routes.popular")}</div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-center text-sm opacity-90">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {locale === "mn" ? r.from : r.fromEn}
                  <ArrowRight className="w-3.5 h-3.5 mx-2" />
                  <span className="font-semibold">{locale === "mn" ? r.to : r.toEn}</span>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-2xl font-bold">{locale === "mn" ? r.to : r.toEn}</div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider opacity-80">{t("routes.from")}</div>
                    <div className="font-bold text-gold-300">{r.price}</div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 ring-1 ring-white/0 group-hover:ring-gold-400/60 transition rounded-2xl" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
