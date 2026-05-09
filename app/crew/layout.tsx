import { Navbar } from "@/components/shared/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plane, Calendar, ClipboardList, CloudSun } from "lucide-react";

const NAV = [
  { href: "/crew", label: "Өнөөдрийн нислэг", icon: Calendar },
  { href: "/crew/logbook", label: "Логбүүк", icon: ClipboardList },
  { href: "/crew/weather", label: "Цаг агаар", icon: CloudSun },
];

export default async function CrewLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin?callbackUrl=/crew");
  if (session.user.role !== "PILOT" && session.user.role !== "ADMIN") redirect("/dashboard");
  return (
    <>
      <Navbar />
      <div className="pt-16 grid lg:grid-cols-[260px_1fr] min-h-svh bg-navy-950 text-navy-100">
        <aside className="hidden lg:block border-r border-white/10 p-5">
          <div className="text-xs uppercase tracking-[.2em] text-gold-400 font-semibold mb-4 flex items-center gap-2"><Plane className="w-3.5 h-3.5" /> Crew Portal</div>
          <nav className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm">
                <Icon className="w-4 h-4 text-gold-400" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-6 lg:p-10">
          <div className="lg:hidden mb-5 flex flex-wrap gap-2">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="text-xs px-3 py-1.5 rounded-lg border border-white/20">{label}</Link>
            ))}
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
