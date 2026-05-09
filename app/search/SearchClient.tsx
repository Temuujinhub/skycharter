"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "@/components/shared/LocaleProvider";
import { ArrowRight, MapPin, Users, Calendar, Plane } from "lucide-react";
import { formatUSD, formatMinutes } from "@/lib/pricing";

const RouteMap = dynamic(() => import("@/components/booking/RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <div className="w-full h-full grid place-items-center text-[rgb(var(--muted))]">Газрын зураг ачааллаж байна…</div>,
});

type Loc = { id: string; name: string; nameEn: string; lat: number; lng: number; landingFee: string };
type Aircraft = { id: string; tailNumber: string; model: string; capacity: number; hourlyRate: string; cruiseSpeed: number; imageUrl: string | null };
type Quote = { aircraft: Aircraft; quote: { distanceKm: number; flightMinutes: number; basePrice: number; fees: number; discount: number; total: number } };

export function SearchClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const { t, locale } = useLocale();

  const [locations, setLocations] = useState<Loc[]>([]);
  const [fromId, setFromId] = useState<string>(sp.get("from") ?? "");
  const [toId, setToId] = useState<string>(sp.get("to") ?? "");
  const [date, setDate] = useState<string>(sp.get("date") ?? new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [pax, setPax] = useState<number>(Number(sp.get("pax") ?? 2));
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"from" | "to">(fromId ? "to" : "from");

  useEffect(() => {
    fetch("/api/locations").then((r) => r.json()).then((d) => setLocations(d.locations ?? []));
  }, []);

  const points = useMemo(
    () => locations.map((l) => ({ id: l.id, name: l.name, nameEn: l.nameEn, lat: l.lat, lng: l.lng })),
    [locations],
  );

  function selectOnMap(id: string) {
    if (step === "from") {
      setFromId(id);
      if (!toId) setStep("to");
    } else {
      if (id !== fromId) setToId(id);
    }
  }

  async function getQuotes() {
    if (!fromId || !toId) return;
    setLoading(true);
    const r = await fetch("/api/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fromLocId: fromId, toLocId: toId, pax }),
    });
    const d = await r.json();
    setQuotes(d.quotes ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (fromId && toId) getQuotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromId, toId, pax]);

  function book(aircraftId: string) {
    const params = new URLSearchParams({ from: fromId, to: toId, date, pax: String(pax), aircraft: aircraftId });
    router.push(`/booking/new?${params.toString()}`);
  }

  const fromLoc = locations.find((l) => l.id === fromId);
  const toLoc = locations.find((l) => l.id === toId);

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 grid lg:grid-cols-[420px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="card p-5 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-gold-500" /> Хаанаас, хаашаа?</h2>
          <div className="text-xs text-[rgb(var(--muted))]">Газрын зураг дээрээс эсвэл доороос сонгоорой.</div>

          <div>
            <label className="label flex items-center justify-between">{t("search.from")}
              <button onClick={() => setStep("from")} className={`text-[10px] font-semibold ${step === "from" ? "text-gold-500" : "text-[rgb(var(--muted))]"}`}>{step === "from" ? "сонгож байна" : "идэвхжүүлэх"}</button>
            </label>
            <select className="input" value={fromId} onChange={(e) => setFromId(e.target.value)}>
              <option value="">— Сонгох —</option>
              {locations.map((l) => <option key={l.id} value={l.id} disabled={l.id === toId}>{locale === "mn" ? l.name : l.nameEn}</option>)}
            </select>
          </div>

          <div>
            <label className="label flex items-center justify-between">{t("search.to")}
              <button onClick={() => setStep("to")} className={`text-[10px] font-semibold ${step === "to" ? "text-gold-500" : "text-[rgb(var(--muted))]"}`}>{step === "to" ? "сонгож байна" : "идэвхжүүлэх"}</button>
            </label>
            <select className="input" value={toId} onChange={(e) => setToId(e.target.value)}>
              <option value="">— Сонгох —</option>
              {locations.map((l) => <option key={l.id} value={l.id} disabled={l.id === fromId}>{locale === "mn" ? l.name : l.nameEn}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label flex items-center gap-1"><Calendar className="w-3 h-3" /> {t("search.when")}</label>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="label flex items-center gap-1"><Users className="w-3 h-3" /> {t("search.pax")}</label>
              <input className="input" type="number" min={1} max={20} value={pax} onChange={(e) => setPax(Number(e.target.value) || 1)} />
            </div>
          </div>

          <button className="btn btn-primary w-full" onClick={getQuotes} disabled={!fromId || !toId || loading}>
            {loading ? t("common.loading") : t("search.submit")}
          </button>
        </div>

        {fromLoc && toLoc && (
          <div className="card p-5">
            <div className="flex items-center text-sm font-semibold gap-2">
              {locale === "mn" ? fromLoc.name : fromLoc.nameEn}
              <ArrowRight className="w-4 h-4 text-gold-500" />
              {locale === "mn" ? toLoc.name : toLoc.nameEn}
            </div>
            <div className="text-xs text-[rgb(var(--muted))] mt-1">{quotes[0] ? `${quotes[0].quote.distanceKm} ${t("fleet.km")} · ~${formatMinutes(quotes[0].quote.flightMinutes)}` : ""}</div>
          </div>
        )}
      </aside>

      {/* Map + results */}
      <div className="space-y-6">
        <div className="h-[420px] card overflow-hidden">
          <RouteMap locations={points} fromId={fromId} toId={toId} onSelect={selectOnMap} locale={locale} />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">Боломжит онгоцууд</h3>
          {!fromId || !toId ? (
            <div className="card p-8 text-center text-[rgb(var(--muted))]">
              Газрын зураг дээрээс хөдлөх болон хүрэх цэгээ сонгоорой.
            </div>
          ) : loading ? (
            <div className="card p-8 text-center text-[rgb(var(--muted))]">{t("common.loading")}</div>
          ) : quotes.length === 0 ? (
            <div className="card p-8 text-center text-[rgb(var(--muted))]">{t("search.noResults")}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {quotes.map((q) => (
                <article key={q.aircraft.id} className="card p-5 hover:shadow-lg transition flex flex-col">
                  <div
                    className="aspect-[16/9] bg-cover bg-center rounded-lg mb-4"
                    style={{ backgroundImage: `url(${q.aircraft.imageUrl ?? "https://images.unsplash.com/photo-1583500178690-f7eb09e7c5b7?auto=format&fit=crop&w=900&q=80"})` }}
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-[rgb(var(--muted))] flex items-center gap-1.5"><Plane className="w-3 h-3 text-gold-500" /> {q.aircraft.tailNumber}</div>
                      <h4 className="font-bold text-lg">{q.aircraft.model}</h4>
                      <div className="text-xs text-[rgb(var(--muted))] mt-0.5">{q.aircraft.capacity} {t("fleet.passengers")} · {q.aircraft.cruiseSpeed} {t("fleet.kmh")}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gold-600">{formatUSD(q.quote.total)}</div>
                      <div className="text-xs text-[rgb(var(--muted))]">{formatMinutes(q.quote.flightMinutes)}</div>
                    </div>
                  </div>
                  <button onClick={() => book(q.aircraft.id)} className="btn btn-primary mt-4">
                    {t("fleet.select")} <ArrowRight className="w-4 h-4" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
