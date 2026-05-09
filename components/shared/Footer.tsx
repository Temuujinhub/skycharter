"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from "./LocaleProvider";

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="bg-navy-900 text-navy-100 mt-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 font-semibold text-white">
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-white p-1.5">
              <Image src="/images/logo-mark.png" alt="Sky Charter Mongolia" width={32} height={32} className="w-full h-full object-contain" />
            </span>
            <span>Sky Charter Mongolia</span>
          </div>
          <p className="mt-4 text-sm opacity-80">{t("brand.tagline")}</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("nav.fleet")}</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link href="/fleet" className="hover:text-gold-400">Cessna 208B EX</Link></li>
            <li><Link href="/fleet" className="hover:text-gold-400">Airbus H145T2</Link></li>
            <li><Link href="/empty-legs" className="hover:text-gold-400">{t("nav.emptyLegs")}</Link></li>
            <li><Link href="/routes" className="hover:text-gold-400">{t("nav.routes")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("nav.about")}</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link href="/about" className="hover:text-gold-400">{t("nav.about")}</Link></li>
            <li><Link href="/contact" className="hover:text-gold-400">{t("nav.contact")}</Link></li>
            <li><Link href="/auth/signin" className="hover:text-gold-400">{t("nav.signin")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.contactUs")}</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-gold-400" /> {t("footer.phone")}</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-gold-400" /> {t("footer.email")}</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-gold-400" /> {t("footer.address")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Sky Charter Mongolia LLC. {t("footer.rights")}.
      </div>
    </footer>
  );
}
