"use client";

import { useLocale } from "./LocaleProvider";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center text-xs font-semibold rounded-lg border border-[rgb(var(--border))] overflow-hidden">
      <button
        onClick={() => setLocale("mn")}
        className={`px-2.5 py-1.5 transition ${locale === "mn" ? "bg-navy-800 text-white" : "hover:bg-[rgb(var(--border)/.3)]"}`}
      >
        MN
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`px-2.5 py-1.5 transition ${locale === "en" ? "bg-navy-800 text-white" : "hover:bg-[rgb(var(--border)/.3)]"}`}
      >
        EN
      </button>
    </div>
  );
}
