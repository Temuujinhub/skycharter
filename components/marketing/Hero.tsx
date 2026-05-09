"use client";

import { useLocale } from "@/components/shared/LocaleProvider";
import Link from "next/link";
import { Plane, ChevronRight } from "lucide-react";
import { FloatingSearchBar } from "./FloatingSearchBar";

export function Hero() {
  const { t } = useLocale();
  return (
    <section className="relative min-h-[100svh] flex flex-col">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=2400&q=80')",
        }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative flex-1 flex items-center pt-28 pb-40">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10 items-center w-full text-white">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[.25em] text-gold-300 font-semibold">
              <span className="w-8 h-px bg-gold-300" />
              {t("hero.eyebrow")}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              {t("hero.title")}
            </h1>
            <p className="text-lg lg:text-xl opacity-90 max-w-xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/search" className="btn btn-gold">
                {t("hero.ctaSearch")} <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/fleet" className="btn btn-outline-light">
                <Plane className="w-4 h-4" /> {t("hero.ctaFleet")}
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-6 text-sm opacity-90">
              <div>
                <div className="text-2xl font-bold text-gold-300">2</div>
                <div className="text-xs uppercase tracking-wider opacity-80">VIP онгоц</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-300">21</div>
                <div className="text-xs uppercase tracking-wider opacity-80">Аймаг</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-300">24/7</div>
                <div className="text-xs uppercase tracking-wider opacity-80">Үйлчилгээ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating search bar */}
      <div className="relative -mt-24 z-10 px-5 lg:px-8 pb-10">
        <div className="max-w-5xl mx-auto">
          <FloatingSearchBar />
        </div>
      </div>
    </section>
  );
}
