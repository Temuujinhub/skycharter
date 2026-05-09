"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/components/shared/LocaleProvider";

export default function SignUpPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const r = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(form), headers: { "content-type": "application/json" } });
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      setErr(d?.error?.formErrors?.[0] || (typeof d?.error === "string" ? d.error : "Бүртгэл амжилтгүй"));
      setLoading(false); return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-svh grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="flex items-center gap-2.5 font-semibold mb-3">
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-white p-1.5">
              <Image src="/skycharter_logo.jpg" alt="Sky Charter Mongolia" width={32} height={32} className="w-full h-full object-contain" />
            </span>
            Sky Charter Mongolia
          </div>
          <h2 className="text-4xl font-bold leading-tight">Premium private aviation, нэг бүртгэлээр.</h2>
        </div>
      </div>
      <div className="grid place-items-center p-6 lg:p-12">
        <form onSubmit={submit} className="card w-full max-w-md p-8">
          <h1 className="text-3xl font-bold">{t("auth.signup")}</h1>
          <div className="space-y-3 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">{t("auth.firstName")}</label>
                <input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <label className="label">{t("auth.lastName")}</label>
                <input className="input" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">{t("auth.email")}</label>
              <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("auth.phone")}</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("auth.password")}</label>
              <input className="input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            {err && <div className="text-sm text-red-600">{err}</div>}
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? t("common.loading") : t("auth.submit")}
            </button>
          </div>
          <p className="text-sm text-center text-[rgb(var(--muted))] mt-5">
            {t("auth.haveAccount")} <Link href="/auth/signin" className="text-gold-500 font-semibold hover:underline">{t("auth.signin")}</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
