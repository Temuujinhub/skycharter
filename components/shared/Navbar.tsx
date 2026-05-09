"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useLocale } from "./LocaleProvider";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const { t } = useLocale();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/fleet", label: t("nav.fleet") },
    { href: "/routes", label: t("nav.routes") },
    { href: "/empty-legs", label: t("nav.emptyLegs") },
    { href: "/about", label: t("nav.about") },
  ];

  const role = session?.user?.role;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition ${
        transparent
          ? "bg-transparent text-white"
          : "bg-[rgb(var(--bg))] text-[rgb(var(--fg))] border-b border-[rgb(var(--border))]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold">
          <span className={`grid place-items-center w-10 h-10 rounded-lg p-1.5 ${transparent ? "bg-white/15 backdrop-blur" : "bg-white ring-1 ring-[rgb(var(--border))]"}`}>
            <Image
              src="/images/logo-mark.png"
              alt="Sky Charter Mongolia"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </span>
          <span className="hidden sm:block tracking-tight">Sky Charter Mongolia</span>
          <span className="sm:hidden tracking-tight">SCM</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`link-underline ${pathname === l.href ? "font-semibold" : "opacity-90 hover:opacity-100"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          {status === "authenticated" ? (
            <div className="hidden md:flex items-center gap-2">
              {role === "ADMIN" && (
                <Link href="/admin" className="btn btn-ghost text-xs px-3 py-2">{t("nav.admin")}</Link>
              )}
              {role === "PILOT" && (
                <Link href="/crew" className="btn btn-ghost text-xs px-3 py-2">{t("nav.crew")}</Link>
              )}
              {role === "CUSTOMER" && (
                <Link href="/dashboard" className="btn btn-ghost text-xs px-3 py-2">
                  <User className="w-3.5 h-3.5" /> {t("nav.dashboard")}
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-ghost text-xs px-3 py-2"
                title={t("nav.signout")}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/signin" className="btn btn-ghost text-xs px-3 py-2">{t("nav.signin")}</Link>
              <Link href="/auth/signup" className="btn btn-gold text-xs px-3 py-2">{t("nav.signup")}</Link>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 grid place-items-center rounded-lg border border-current/20"
            aria-label="Menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[rgb(var(--bg))] text-[rgb(var(--fg))] border-t border-[rgb(var(--border))] px-5 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block py-1.5 text-sm" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-[rgb(var(--border))]">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          {status === "authenticated" ? (
            <div className="space-y-2">
              {role === "ADMIN" && <Link href="/admin" className="btn btn-ghost w-full">{t("nav.admin")}</Link>}
              {role === "PILOT" && <Link href="/crew" className="btn btn-ghost w-full">{t("nav.crew")}</Link>}
              {role === "CUSTOMER" && <Link href="/dashboard" className="btn btn-ghost w-full">{t("nav.dashboard")}</Link>}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-ghost w-full">{t("nav.signout")}</button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/auth/signin" className="btn btn-ghost w-full">{t("nav.signin")}</Link>
              <Link href="/auth/signup" className="btn btn-gold w-full">{t("nav.signup")}</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
