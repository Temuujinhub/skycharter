"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale } from "@/components/shared/LocaleProvider";
import { ArrowRight, ArrowLeft, Check, Plane, MapPin, Calendar, Users, CreditCard, FileText, Smartphone } from "lucide-react";
import { formatUSD, formatMinutes } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

type Loc = { id: string; name: string; nameEn: string; lat: number; lng: number; landingFee: string };
type Aircraft = { id: string; tailNumber: string; model: string; capacity: number; hourlyRate: string; cruiseSpeed: number; imageUrl: string | null };
type Quote = { aircraft: Aircraft; quote: { distanceKm: number; flightMinutes: number; basePrice: number; fees: number; discount: number; total: number } };

export function BookingWizard() {
  const sp = useSearchParams();
  const router = useRouter();
  const { t, locale } = useLocale();
  const { data: session } = useSession();

  const initialFrom = sp.get("from") ?? "";
  const initialTo = sp.get("to") ?? "";
  const initialAircraft = sp.get("aircraft") ?? "";
  const initialDate = sp.get("date") ?? new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const initialPax = Number(sp.get("pax") ?? 2);
  const emptyLegId = sp.get("empty") ?? undefined;

  const [step, setStep] = useState(initialFrom && initialTo ? (initialAircraft ? 2 : 1) : 0);

  const [locations, setLocations] = useState<Loc[]>([]);
  const [fromId, setFromId] = useState(initialFrom);
  const [toId, setToId] = useState(initialTo);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("09:00");
  const [pax, setPax] = useState(initialPax);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState(initialAircraft);
  const [emptyLeg, setEmptyLeg] = useState<{ aircraftId: string; fromLocId: string; toLocId: string; departureTime: string; discountPct: number } | null>(null);

  const [passengers, setPassengers] = useState([{ fullName: "", document: "", weightKg: 75 }]);
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<"QPAY" | "CARD" | "SOCIALPAY" | "INVOICE">("QPAY");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/locations").then((r) => r.json()).then((d) => setLocations(d.locations ?? []));
  }, []);

  useEffect(() => {
    if (emptyLegId) {
      fetch("/api/empty-legs").then((r) => r.json()).then((d) => {
        const el = (d.emptyLegs ?? []).find((e: { id: string }) => e.id === emptyLegId);
        if (el) {
          setEmptyLeg({ aircraftId: el.aircraftId, fromLocId: el.fromLocId, toLocId: el.toLocId, departureTime: el.departureTime, discountPct: el.discountPct });
          setFromId(el.fromLocId); setToId(el.toLocId); setSelectedAircraft(el.aircraftId);
          const dt = new Date(el.departureTime);
          setDate(dt.toISOString().slice(0, 10));
          setTime(dt.toISOString().slice(11, 16));
          setStep(2);
        }
      });
    }
  }, [emptyLegId]);

  useEffect(() => {
    setPassengers((prev) => {
      const next = [...prev];
      while (next.length < pax) next.push({ fullName: "", document: "", weightKg: 75 });
      return next.slice(0, pax);
    });
  }, [pax]);

  useEffect(() => {
    if (fromId && toId) {
      fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fromLocId: fromId, toLocId: toId, pax, emptyLegId }),
      }).then((r) => r.json()).then((d) => setQuotes(d.quotes ?? []));
    }
  }, [fromId, toId, pax, emptyLegId]);

  const fromLoc = locations.find((l) => l.id === fromId);
  const toLoc = locations.find((l) => l.id === toId);
  const chosen = quotes.find((q) => q.aircraft.id === selectedAircraft) ?? quotes[0];

  const steps = useMemo(() => [
    { key: 0, label: t("booking.step1"), icon: MapPin },
    { key: 1, label: t("booking.step2"), icon: Plane },
    { key: 2, label: t("booking.step3"), icon: Check },
  ], [t]);

  async function submit() {
    if (!fromId || !toId || !selectedAircraft) return;
    setSubmitting(true);
    const departureISO = new Date(`${date}T${time}:00`).toISOString();
    const r = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fromLocId: fromId, toLocId: toId, aircraftId: selectedAircraft,
        departureTime: departureISO, pax, passengers,
        guestName: !session ? guest.name : undefined,
        guestEmail: !session ? guest.email : undefined,
        guestPhone: !session ? guest.phone : undefined,
        emptyLegId, paymentMethod,
      }),
    });
    const d = await r.json();
    if (!r.ok) { setSubmitting(false); alert(d?.error ? "Захиалга үүсгэхэд алдаа" : "Алдаа"); return; }

    // Create payment
    const pr = await fetch("/api/payments/mock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookingId: d.booking.id, method: paymentMethod }),
    });
    await pr.json();

    router.push(`/booking/${d.booking.id}`);
  }

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = step >= s.key;
          return (
            <div key={s.key} className="flex items-center gap-3 flex-1">
              <div className={`w-9 h-9 rounded-full grid place-items-center transition ${active ? "bg-gold-400 text-navy-900" : "bg-[rgb(var(--border))] text-[rgb(var(--muted))]"}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className={`text-sm font-semibold ${active ? "text-[rgb(var(--fg))]" : "text-[rgb(var(--muted))]"}`}>{s.label}</div>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${step > s.key ? "bg-gold-400" : "bg-[rgb(var(--border))]"}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="card p-7">
          {/* Step 0 — Route */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold">Чиглэл болон огноо</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t("search.from")}</label>
                  <select className="input" value={fromId} onChange={(e) => setFromId(e.target.value)}>
                    <option value="">— Сонгох —</option>
                    {locations.map((l) => <option key={l.id} value={l.id} disabled={l.id === toId}>{locale === "mn" ? l.name : l.nameEn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{t("search.to")}</label>
                  <select className="input" value={toId} onChange={(e) => setToId(e.target.value)}>
                    <option value="">— Сонгох —</option>
                    {locations.map((l) => <option key={l.id} value={l.id} disabled={l.id === fromId}>{locale === "mn" ? l.name : l.nameEn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label flex items-center gap-1"><Calendar className="w-3 h-3" /> Огноо</label>
                  <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label className="label">Цаг</label>
                  <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div>
                  <label className="label flex items-center gap-1"><Users className="w-3 h-3" /> {t("search.pax")}</label>
                  <input className="input" type="number" min={1} max={20} value={pax} onChange={(e) => setPax(Number(e.target.value) || 1)} />
                </div>
              </div>
              <div className="flex justify-end pt-3">
                <button disabled={!fromId || !toId} onClick={() => setStep(1)} className="btn btn-primary">
                  {t("booking.next")} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 1 — Aircraft */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold">Онгоцоо сонгоно уу</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quotes.map((q) => {
                  const sel = selectedAircraft === q.aircraft.id;
                  return (
                    <button
                      key={q.aircraft.id}
                      onClick={() => setSelectedAircraft(q.aircraft.id)}
                      className={`card p-4 text-left transition ${sel ? "ring-2 ring-gold-400" : "hover:shadow-md"}`}
                    >
                      <div
                        className="aspect-[16/9] bg-cover bg-center rounded-lg mb-3"
                        style={{ backgroundImage: `url(${q.aircraft.imageUrl ?? "https://images.unsplash.com/photo-1583500178690-f7eb09e7c5b7?auto=format&fit=crop&w=900&q=80"})` }}
                      />
                      <div className="font-bold">{q.aircraft.model}</div>
                      <div className="text-xs text-[rgb(var(--muted))]">{q.aircraft.capacity} {t("fleet.passengers")} · {q.aircraft.cruiseSpeed} {t("fleet.kmh")}</div>
                      <div className="text-xl font-bold text-gold-600 mt-2">{formatUSD(q.quote.total)}</div>
                      <div className="text-xs text-[rgb(var(--muted))]">{formatMinutes(q.quote.flightMinutes)} · {q.quote.distanceKm} км</div>
                    </button>
                  );
                })}
                {quotes.length === 0 && <div className="col-span-2 text-[rgb(var(--muted))]">{t("common.loading")}</div>}
              </div>
              <div className="flex justify-between pt-3">
                <button onClick={() => setStep(0)} className="btn btn-ghost"><ArrowLeft className="w-4 h-4" /> {t("booking.back")}</button>
                <button disabled={!selectedAircraft} onClick={() => setStep(2)} className="btn btn-primary">
                  {t("booking.next")} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Confirm */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{t("booking.passengerInfo")}</h2>

              {!session && (
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label">{t("booking.fullName")}</label>
                    <input className="input" required value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">{t("booking.email")}</label>
                    <input className="input" type="email" required value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">{t("booking.phone")}</label>
                    <input className="input" required value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {passengers.map((p, i) => (
                  <div key={i} className="grid sm:grid-cols-[1fr_1fr_120px] gap-3">
                    <div>
                      <label className="label">Зорчигч {i + 1} - {t("booking.fullName")}</label>
                      <input className="input" required value={p.fullName} onChange={(e) => {
                        const c = [...passengers]; c[i].fullName = e.target.value; setPassengers(c);
                      }} />
                    </div>
                    <div>
                      <label className="label">{t("booking.document")}</label>
                      <input className="input" value={p.document ?? ""} onChange={(e) => {
                        const c = [...passengers]; c[i].document = e.target.value; setPassengers(c);
                      }} />
                    </div>
                    <div>
                      <label className="label">Жин (кг)</label>
                      <input className="input" type="number" value={p.weightKg ?? 0} onChange={(e) => {
                        const c = [...passengers]; c[i].weightKg = Number(e.target.value); setPassengers(c);
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-bold mb-3">{t("booking.paymentMethod")}</h3>
                <div className="grid sm:grid-cols-4 gap-2">
                  {(["QPAY", "CARD", "SOCIALPAY", "INVOICE"] as const).map((m) => {
                    const Icon = m === "QPAY" ? Smartphone : m === "CARD" ? CreditCard : m === "SOCIALPAY" ? Smartphone : FileText;
                    const labels = { QPAY: t("booking.qpay"), CARD: t("booking.card"), SOCIALPAY: t("booking.socialpay"), INVOICE: t("booking.invoice") };
                    return (
                      <button key={m} onClick={() => setPaymentMethod(m)} className={`card p-4 text-center transition ${paymentMethod === m ? "ring-2 ring-gold-400" : "hover:shadow"}`}>
                        <Icon className="w-5 h-5 mx-auto mb-1 text-gold-500" />
                        <div className="text-xs font-semibold">{labels[m]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-xs p-3">
                {t("booking.mockNote")}
              </div>

              <div className="flex justify-between pt-3">
                <button onClick={() => setStep(1)} className="btn btn-ghost"><ArrowLeft className="w-4 h-4" /> {t("booking.back")}</button>
                <button disabled={submitting || !chosen} onClick={submit} className="btn btn-gold">
                  {submitting ? t("common.loading") : <>{t("booking.pay")} {chosen ? formatUSD(chosen.quote.total) : ""}</>}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="card p-6 h-fit lg:sticky lg:top-24 space-y-4">
          <h3 className="font-bold">{t("booking.summary")}</h3>
          {fromLoc && toLoc && (
            <div>
              <div className="text-xs text-[rgb(var(--muted))]">Чиглэл</div>
              <div className="font-semibold flex items-center gap-2 text-sm mt-0.5">
                {locale === "mn" ? fromLoc.name : fromLoc.nameEn}
                <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
                {locale === "mn" ? toLoc.name : toLoc.nameEn}
              </div>
            </div>
          )}
          {chosen && (
            <>
              <div className="border-t border-[rgb(var(--border))]" />
              <div className="text-sm space-y-2">
                <Row label="Онгоц" value={chosen.aircraft.model} />
                <Row label={t("booking.distance")} value={`${chosen.quote.distanceKm} км`} />
                <Row label={t("booking.duration")} value={formatMinutes(chosen.quote.flightMinutes)} />
                <Row label={t("booking.basePrice")} value={formatUSD(chosen.quote.basePrice)} />
                <Row label={t("booking.fees")} value={formatUSD(chosen.quote.fees)} />
                {chosen.quote.discount > 0 && <Row label={t("booking.discount")} value={`−${formatUSD(chosen.quote.discount)}`} className="text-emerald-600" />}
                <div className="border-t border-[rgb(var(--border))] pt-2 mt-2 flex items-baseline justify-between">
                  <span className="text-sm font-semibold">{t("booking.total")}</span>
                  <span className="text-2xl font-bold text-gold-600">{formatUSD(chosen.quote.total)}</span>
                </div>
              </div>
            </>
          )}
          {date && time && (
            <div className="text-xs text-[rgb(var(--muted))] pt-2 border-t border-[rgb(var(--border))]">
              <Calendar className="inline w-3 h-3 mr-1" /> {formatDate(`${date}T${time}:00`, locale)}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-center justify-between ${className ?? ""}`}>
      <span className="text-[rgb(var(--muted))]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
