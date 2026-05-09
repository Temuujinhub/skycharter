import mn from "@/messages/mn.json";
import en from "@/messages/en.json";

export type Locale = "mn" | "en";
export const locales: Locale[] = ["mn", "en"];
export const defaultLocale: Locale = "mn";

const dicts = { mn, en } as const;

export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const parts = key.split(".");
  let cur: unknown = dicts[locale] ?? dicts[defaultLocale];
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      cur = undefined;
      break;
    }
  }
  if (typeof cur !== "string") {
    // fallback to default locale
    let fb: unknown = dicts[defaultLocale];
    for (const p of parts) {
      if (fb && typeof fb === "object" && p in (fb as Record<string, unknown>)) {
        fb = (fb as Record<string, unknown>)[p];
      } else {
        fb = undefined;
        break;
      }
    }
    cur = typeof fb === "string" ? fb : key;
  }
  let s = cur as string;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

export function isLocale(s: string): s is Locale {
  return (locales as string[]).includes(s);
}
