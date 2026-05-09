"use client";

import { useLocale } from "@/components/shared/LocaleProvider";
import { Award, Clock, ShieldCheck, Sparkles } from "lucide-react";

const ICONS = [Award, Clock, ShieldCheck, Sparkles];

export function WhyUs() {
  const { t, locale } = useLocale();
  // We have to read the array structure from messages directly
  const items = (locale === "mn"
    ? [
        { title: "Тансаг зэрэглэлийн үйлчилгээ", desc: "VIP стандартын үйлчилгээ, хувийн зөвлөх." },
        { title: "Уян хатан хуваарь", desc: "Хүссэн цагтаа, ямар ч буудлаас нис." },
        { title: "Аюулгүй байдал", desc: "Олон улсын стандартын засвар үйлчилгээ, туршлагатай нисгэгчид." },
        { title: "Ил тод үнэ", desc: "Нуугдмал хураамжгүй, шууд үнийн санал." },
      ]
    : [
        { title: "Luxury service", desc: "VIP-grade service with a personal concierge." },
        { title: "Flexible schedule", desc: "Fly whenever, from any airfield." },
        { title: "Safety first", desc: "International maintenance standards, seasoned pilots." },
        { title: "Transparent pricing", desc: "No hidden fees, instant quotes." },
      ]);

  return (
    <section className="py-24 px-5 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 aurora opacity-50" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold">{t("whyUs.title")}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div key={i} className="card p-7 hover:-translate-y-1 transition">
                <div className="w-12 h-12 rounded-xl bg-navy-800 text-gold-400 grid place-items-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-[rgb(var(--muted))] mt-2">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
