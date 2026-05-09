"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/shared/LocaleProvider";
import { ArrowRight, Plane, MapPin, Calendar, Users, Check } from "lucide-react";
import { formatUSD, formatMinutes } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

type Booking = {
  id: string;
  bookingCode: string;
  status: string;
  paxCount: number;
  distanceKm: number;
  estFlightMinutes: number;
  basePrice: string; fees: string; totalPrice: string;
  departureTime: string;
  aircraft: { model: string; tailNumber: string };
  departureLoc: { name: string; nameEn: string };
  arrivalLoc: { name: string; nameEn: string };
  passengers: { id: string; fullName: string; document: string | null; weightKg: number | null }[];
  payment: { method: string; status: string; qrCode: string | null; amount: string; txReference: string | null } | null;
};

export function BookingDetail({ id }: { id: string }) {
  const { t, locale } = useLocale();
  const [b, setB] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  async function load() {
    const r = await fetch(`/api/bookings/${id}`);
    const d = await r.json();
    setB(d.booking);
    setLoading(false);
  }

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function confirmQpay() {
    if (!b) return;
    setConfirming(true);
    await fetch("/api/payments/mock", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ bookingId: b.id }) });
    await load();
    setConfirming(false);
  }

  if (loading) return <div className="max-w-3xl mx-auto px-5 py-12 text-center">{t("common.loading")}</div>;
  if (!b) return <div className="max-w-3xl mx-auto px-5 py-12 text-center">Олдсонгүй.</div>;

  const isPaid = b.payment?.status === "PAID";
  const isPending = b.payment?.status === "PENDING";
  const showQR = b.payment?.method === "QPAY" && isPending && b.payment?.qrCode;

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 space-y-6">
      <div className="card p-7">
        {b.status === "CONFIRMED" && (
          <div className="flex items-center gap-2 text-emerald-600 mb-4">
            <Check className="w-5 h-5" />
            <span className="font-bold">{t("booking.confirmed")}</span>
          </div>
        )}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[rgb(var(--muted))]">{t("booking.ticketCode")}</div>
            <h1 className="text-3xl font-bold tracking-wide">{b.bookingCode}</h1>
          </div>
          <span className={`pill pill-${b.status.toLowerCase()}`}>{t(`status.${b.status}`)}</span>
        </div>

        <div className="border-t border-[rgb(var(--border))] my-6" />

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center text-2xl font-bold gap-3">
              {locale === "mn" ? b.departureLoc.name : b.departureLoc.nameEn}
              <ArrowRight className="w-5 h-5 text-gold-500" />
              {locale === "mn" ? b.arrivalLoc.name : b.arrivalLoc.nameEn}
            </div>
            <div className="text-sm text-[rgb(var(--muted))] mt-2 space-y-1.5">
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(b.departureTime, locale)}</div>
              <div className="flex items-center gap-1.5"><Plane className="w-3.5 h-3.5" /> {b.aircraft.model} · {b.aircraft.tailNumber}</div>
              <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {b.paxCount} зорчигч</div>
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {b.distanceKm} км · {formatMinutes(b.estFlightMinutes)}</div>
            </div>
          </div>
          <div className="rounded-xl bg-navy-50 dark:bg-navy-800/40 p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[rgb(var(--muted))]">{t("booking.basePrice")}</span><span className="font-semibold">{formatUSD(Number(b.basePrice))}</span></div>
            <div className="flex justify-between"><span className="text-[rgb(var(--muted))]">{t("booking.fees")}</span><span className="font-semibold">{formatUSD(Number(b.fees))}</span></div>
            <div className="border-t border-[rgb(var(--border))] pt-2 flex justify-between items-baseline">
              <span className="font-bold">{t("booking.total")}</span>
              <span className="text-2xl font-bold text-gold-600">{formatUSD(Number(b.totalPrice))}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgb(var(--border))] my-6" />

        <div>
          <h3 className="font-bold mb-3">Зорчигчид</h3>
          <ul className="space-y-2 text-sm">
            {b.passengers.map((p) => (
              <li key={p.id} className="flex items-center justify-between border border-[rgb(var(--border))] rounded-lg px-3 py-2">
                <div>
                  <div className="font-semibold">{p.fullName}</div>
                  {p.document && <div className="text-xs text-[rgb(var(--muted))]">{p.document}</div>}
                </div>
                {p.weightKg && <div className="text-xs text-[rgb(var(--muted))]">{p.weightKg} кг</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showQR && (
        <div className="card p-7 text-center">
          <h3 className="font-bold text-lg">{t("booking.scanToPay")}</h3>
          <p className="text-sm text-[rgb(var(--muted))] mt-1">{t("booking.qpay")} · {formatUSD(Number(b.payment?.amount))}</p>
          <img src={b.payment!.qrCode!} alt="QPay QR" className="w-64 h-64 mx-auto mt-4 rounded-xl border border-[rgb(var(--border))] bg-white p-2" />
          <button onClick={confirmQpay} disabled={confirming} className="btn btn-gold mt-5">
            {confirming ? t("common.loading") : "Төлбөр төлсөн (демо)"}
          </button>
          <p className="text-xs text-[rgb(var(--muted))] mt-2">{t("booking.mockNote")}</p>
        </div>
      )}

      {isPaid && (
        <div className="card p-7 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
            <Check className="w-5 h-5" /> Төлбөр амжилттай төлөгдлөө
          </div>
          <p className="text-sm mt-1 text-emerald-700/80 dark:text-emerald-300/80">Tx Ref: {b.payment?.txReference}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/dashboard" className="btn btn-ghost">Миний нислэгүүд</Link>
        <Link href="/" className="btn btn-primary">Нүүр хуудас</Link>
      </div>
    </div>
  );
}
