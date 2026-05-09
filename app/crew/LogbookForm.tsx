"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

type Existing = {
  engineStartAt: string | null;
  takeoffAt: string | null;
  landingAt: string | null;
  engineStopAt: string | null;
  fuelUsedLiters: number | null;
  notes: string | null;
} | null;

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function LogbookForm({ bookingId, existing }: { bookingId: string; existing: Existing }) {
  const router = useRouter();
  const [form, setForm] = useState({
    engineStartAt: toLocalInput(existing?.engineStartAt ?? null),
    takeoffAt: toLocalInput(existing?.takeoffAt ?? null),
    landingAt: toLocalInput(existing?.landingAt ?? null),
    engineStopAt: toLocalInput(existing?.engineStopAt ?? null),
    fuelUsedLiters: existing?.fuelUsedLiters ?? 0,
    notes: existing?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/crew/logbook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookingId, ...form }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
      <h3 className="font-bold">Нислэгийн логбүүк</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Хөдөлгүүр асаасан" type="datetime-local" value={form.engineStartAt} onChange={(v) => setForm({ ...form, engineStartAt: v })} />
        <Field label="Хөөрсөн" type="datetime-local" value={form.takeoffAt} onChange={(v) => setForm({ ...form, takeoffAt: v })} />
        <Field label="Буусан" type="datetime-local" value={form.landingAt} onChange={(v) => setForm({ ...form, landingAt: v })} />
        <Field label="Хөдөлгүүр унтраасан" type="datetime-local" value={form.engineStopAt} onChange={(v) => setForm({ ...form, engineStopAt: v })} />
      </div>
      <Field label="Шатахуун (литр)" type="number" value={String(form.fuelUsedLiters)} onChange={(v) => setForm({ ...form, fuelUsedLiters: Number(v) })} />
      <div>
        <label className="text-xs uppercase tracking-wider opacity-70 font-semibold block mb-1">Тэмдэглэл</label>
        <textarea className="w-full bg-white/10 border border-white/10 rounded-lg p-2.5 text-sm" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>
      <button disabled={saving} className="btn btn-gold">
        <Save className="w-4 h-4" /> {saving ? "Хадгалж байна…" : "Хадгалах"}
      </button>
    </form>
  );
}

function Field({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider opacity-70 font-semibold block mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg p-2.5 text-sm" />
    </div>
  );
}
