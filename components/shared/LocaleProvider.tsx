"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { type Locale, defaultLocale, t as translate } from "@/lib/i18n";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LocaleCtx = createContext<Ctx>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (k) => k,
});

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  );
  return (
    <LocaleCtx.Provider value={{ locale, setLocale, t }}>{children}</LocaleCtx.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleCtx);
}
