import { Navbar } from "@/components/shared/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, CalendarRange, Plane, MapPin, Users, BarChart3, Sparkles } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Самбар", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Захиалгууд", icon: CalendarRange },
  { href: "/admin/fleet", label: "Парк", icon: Plane },
  { href: "/admin/locations", label: "Байршил", icon: MapPin },
  { href: "/admin/empty-legs", label: "Хоосон нислэг", icon: Sparkles },
  { href: "/admin/users", label: "Хэрэглэгчид", icon: Users },
  { href: "/admin/reports", label: "Тайлан", icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return (
    <>
      <Navbar />
      <div className="pt-16 grid lg:grid-cols-[260px_1fr] min-h-svh bg-navy-50/40 dark:bg-navy-950/30">
        <aside className="hidden lg:block border-r border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <div className="text-xs uppercase tracking-[.2em] text-[rgb(var(--muted))] font-semibold mb-4">Удирдлага</div>
          <nav className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgb(var(--border)/.4)] text-sm">
                <Icon className="w-4 h-4 text-gold-500" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-6 lg:p-10">
          <div className="lg:hidden mb-5 flex flex-wrap gap-2 overflow-x-auto">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="btn btn-ghost text-xs px-3 py-1.5">{label}</Link>
            ))}
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
