"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/components/shared/LocaleProvider";

export default function SignInPage() {
  const { t } = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setErr(t("auth.signinError")); return; }
    const cb = params.get("callbackUrl") || "/dashboard";
    router.push(cb);
    router.refresh();
  }

  return (
    <main className="min-h-svh grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="flex items-center gap-2.5 font-semibold mb-3">
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-white p-1.5">
              <Image src="/skycharter_logo.jpg" alt="Sky Charter Mongolia" width={32} height={32} className="w-full h-full object-contain" />
            </span>
            Sky Charter Mongolia
          </div>
          <h2 className="text-4xl font-bold leading-tight">Тэнгэр бол хязгаар, бид бол таны хувийн зам.</h2>
        </div>
      </div>
      <div className="grid place-items-center p-6 lg:p-12">
        <form onSubmit={submit} className="card w-full max-w-md p-8">
          <h1 className="text-3xl font-bold">{t("auth.signin")}</h1>
          <p className="text-sm text-[rgb(var(--muted))] mt-1.5">{t("auth.demoCredentials")}</p>
          <div className="space-y-3 mt-6">
            <div>
              <label className="label">{t("auth.email")}</label>
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">{t("auth.password")}</label>
              <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {err && <div className="text-sm text-red-600">{err}</div>}
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? t("common.loading") : t("auth.submit")}
            </button>
          </div>
          <p className="text-sm text-center text-[rgb(var(--muted))] mt-5">
            {t("auth.noAccount")} <Link href="/auth/signup" className="text-gold-500 font-semibold hover:underline">{t("auth.signup")}</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
