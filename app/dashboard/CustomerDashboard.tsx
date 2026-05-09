"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLocale } from "@/components/shared/LocaleProvider";
import { ArrowRight, Plane, Plus } from "lucide-react";
import { formatUSD } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";

type Booking = {
  id: string;
  bookingCode: string;
  status: string;
  paxCount: number;
  totalPrice: string;
  departureTime: string;
  aircraft: { model: string; tailNumber: string };
  departureLoc: { name: string; nameEn: string };
  arrivalLoc: { name: string; nameEn: string };
};

export function CustomerDashboard() {
  const { data: session } = useSession();
  const { t, locale } = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then((d) => { setBookings(d.bookings ?? []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-8 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.25em] text-gold-500 font-semibold">DASHBOARD</div>
          <h1 className="text-3xl md:text-5xl font-bold mt-1">Сайн уу, {session?.user?.name}</h1>
          <p className="text-[rgb(var(--muted))] mt-2">Таны бүх нислэгийн төлөв болон захиалгуудыг эндээс харна.</p>
        </div>
        <Link href="/search" className="btn btn-gold">
          <Plus className="w-4 h-4" /> Шинэ нислэг захиалах
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgb(var(--border))] font-bold flex items-center gap-2">
          <Plane className="w-4 h-4 text-gold-500" /> Миний нислэгүүд
        </div>
        {loading ? (
          <div className="p-12 text-center text-[rgb(var(--muted))]">{t("common.loading")}</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[rgb(var(--muted))]">Одоогоор захиалгагүй байна.</p>
            <Link href="/search" className="btn btn-primary mt-4 inline-flex">Эхний нислэгээ захиалах <ArrowRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="divide-y divide-[rgb(var(--border))]">
            {bookings.map((b) => (
              <Link key={b.id} href={`/booking/${b.id}`} className="px-6 py-4 grid sm:grid-cols-[1fr_1fr_auto_auto] gap-4 items-center hover:bg-[rgb(var(--border)/.2)] transition">
                <div>
                  <div className="text-xs text-[rgb(var(--muted))]">{b.bookingCode}</div>
                  <div className="font-semibold flex items-center gap-2 text-sm">
                    {locale === "mn" ? b.departureLoc.name : b.departureLoc.nameEn}
                    <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
                    {locale === "mn" ? b.arrivalLoc.name : b.arrivalLoc.nameEn}
                  </div>
                </div>
                <div className="text-sm text-[rgb(var(--muted))]">{b.aircraft.model} · {b.paxCount} зорчигч</div>
                <div className="text-xs text-[rgb(var(--muted))]">{formatDate(b.departureTime, locale)}</div>
                <div className="flex items-center gap-3">
                  <span className={`pill pill-${b.status.toLowerCase()}`}>{t(`status.${b.status}`)}</span>
                  <div className="font-bold text-gold-600">{formatUSD(Number(b.totalPrice))}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
