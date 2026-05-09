"use client";

import { useLocale } from "@/components/shared/LocaleProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

type Loc = { id: string; name: string; nameEn: string };

export function FloatingSearchBar() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [locations, setLocations] = useState<Loc[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState(2);

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((d) => setLocations(d.locations ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setDate(today.toISOString().slice(0, 10));
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    if (pax) params.set("pax", String(pax));
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="card shadow-2xl p-3 grid md:grid-cols-[1.3fr_1.3fr_1fr_.8fr_auto] gap-2"
    >
      <SelectField
        icon={<MapPin className="w-4 h-4" />}
        label={t("search.from")}
        value={from}
        onChange={setFrom}
        options={locations.map((l) => ({ value: l.id, label: locale === "mn" ? l.name : l.nameEn }))}
        placeholder={t("search.fromPlaceholder")}
      />
      <SelectField
        icon={<MapPin className="w-4 h-4" />}
        label={t("search.to")}
        value={to}
        onChange={setTo}
        options={locations.map((l) => ({ value: l.id, label: locale === "mn" ? l.name : l.nameEn }))}
        placeholder={t("search.toPlaceholder")}
      />
      <DateField
        icon={<Calendar className="w-4 h-4" />}
        label={t("search.when")}
        value={date}
        onChange={setDate}
      />
      <NumField
        icon={<Users className="w-4 h-4" />}
        label={t("search.pax")}
        value={pax}
        onChange={setPax}
      />
      <button type="submit" className="btn btn-gold h-full md:px-5">
        <ArrowRight className="w-4 h-4" />
        <span className="hidden md:inline">{t("search.submit")}</span>
      </button>
    </form>
  );
}

function FieldShell({
  icon, label, children,
}: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[rgb(var(--border)/.3)] transition cursor-pointer">
      <div className="text-[rgb(var(--muted))]">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-[rgb(var(--muted))] font-semibold">{label}</div>
        {children}
      </div>
    </div>
  );
}

function SelectField({
  icon, label, value, onChange, options, placeholder,
}: {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder: string;
}) {
  return (
    <FieldShell icon={icon} label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 outline-none text-sm font-semibold text-[rgb(var(--fg))]"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </FieldShell>
  );
}

function DateField(props: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <FieldShell icon={props.icon} label={props.label}>
      <input
        type="date"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full bg-transparent border-0 outline-none text-sm font-semibold text-[rgb(var(--fg))]"
      />
    </FieldShell>
  );
}

function NumField(props: { icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <FieldShell icon={props.icon} label={props.label}>
      <input
        type="number"
        min={1}
        max={20}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value) || 1)}
        className="w-full bg-transparent border-0 outline-none text-sm font-semibold text-[rgb(var(--fg))]"
      />
    </FieldShell>
  );
}
