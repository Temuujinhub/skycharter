import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { LocaleProvider } from "@/components/shared/LocaleProvider";
import { SessionProviderWrapper } from "@/components/shared/SessionProviderWrapper";
import { cookies } from "next/headers";
import { isLocale, defaultLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sky Charter Mongolia — Премиум хувийн нислэгийн үйлчилгээ",
  description:
    "Sky Charter Mongolia LLC — Cessna 208B EX болон Airbus H145T2 онгоцоор Монгол даяар хувийн нислэг захиалгаар үйлчилнэ.",
  keywords: [
    "private jet mongolia",
    "charter flight",
    "Sky Charter Mongolia",
    "хувийн нислэг",
    "Хөвсгөл нислэг",
    "Cessna 208",
    "H145",
  ],
  openGraph: {
    title: "Sky Charter Mongolia",
    description: "Premium private aviation across Mongolia",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const cookieLocale = c.get("locale")?.value ?? defaultLocale;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <SessionProviderWrapper>
          <ThemeProvider>
            <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
