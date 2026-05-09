"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, ExternalLink } from "lucide-react";
import { formatUSD } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/shared/LocaleProvider";

type Booking = {
  id: string; bookingCode: string; status: string; paxCount: number; totalPrice: string;
  departureTime: string; createdAt: string;
  aircraft: { model: string; tailNumber: string };
  departureLoc: { name: string }; arrivalLoc: { name: string };
  user: { firstName: string; lastName: string; email: string } | null;
  guestName: string | null; guestEmail: string | null;
  payment: { status: string; method: string } | null;
};

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const { t } = useLocale();
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [busy, setBusy] = useState<string | null>(null);

  const list = bookings.filter((b) => filter === "ALL" || b.status === filter);

  async function update(id: string, status: string) {
    setBusy(id);
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-[rgb(var(--border))] flex items-center gap-2 flex-wrap">
        {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${filter === s ? "bg-navy-800 text-white" : "border border-[rgb(var(--border))] hover:bg-[rgb(var(--border)/.3)]"}`}>
            {s === "ALL" ? "Бүгд" : t(`status.${s}`)}
          </button>
        ))}
        <span className="text-xs text-[rgb(var(--muted))] ml-auto">{list.length} захиалга</span>
      </div>
      <div className="overflow-x-auto scroll-pretty">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-[rgb(var(--muted))] border-b border-[rgb(var(--border))]">
              <th className="px-5 py-3">Код</th>
              <th className="px-5 py-3">Хэрэглэгч</th>
              <th className="px-5 py-3">Чиглэл</th>
              <th className="px-5 py-3">Хөдлөх</th>
              <th className="px-5 py-3">Онгоц</th>
              <th className="px-5 py-3">Дүн</th>
              <th className="px-5 py-3">Төлөв</th>
              <th className="px-5 py-3">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--border)/.2)]">
                <td className="px-5 py-3 font-semibold">{b.bookingCode}</td>
                <td className="px-5 py-3">
                  <div className="font-semibold">{b.user ? `${b.user.firstName} ${b.user.lastName}` : b.guestName ?? "—"}</div>
                  <div className="text-xs text-[rgb(var(--muted))]">{b.user?.email ?? b.guestEmail}</div>
                </td>
                <td className="px-5 py-3">{b.departureLoc.name} → {b.arrivalLoc.name}</td>
                <td className="px-5 py-3 text-xs">{formatDate(b.departureTime, "mn")}</td>
                <td className="px-5 py-3 text-xs">{b.aircraft.model}</td>
                <td className="px-5 py-3 font-bold text-gold-600">{formatUSD(Number(b.totalPrice))}</td>
                <td className="px-5 py-3">
                  <span className={`pill pill-${b.status.toLowerCase()}`}>{t(`status.${b.status}`)}</span>
                  {b.payment && <span className={`pill pill-${b.payment.status.toLowerCase()} ml-1`}>{b.payment.method}</span>}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {b.status === "PENDING" && (
                      <button disabled={busy === b.id} onClick={() => update(b.id, "CONFIRMED")} title="Confirm" className="w-8 h-8 grid place-items-center rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                      <button disabled={busy === b.id} onClick={() => update(b.id, "CANCELLED")} title="Cancel" className="w-8 h-8 grid place-items-center rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <Link href={`/booking/${b.id}`} title="Open" className="w-8 h-8 grid place-items-center rounded hover:bg-[rgb(var(--border)/.4)]">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-[rgb(var(--muted))]">Захиалга алга</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
