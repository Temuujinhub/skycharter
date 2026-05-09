import { prisma } from "@/lib/db";
import { Sparkles } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Хэрэглэгчид</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-[rgb(var(--muted))] border-b border-[rgb(var(--border))]">
              <th className="px-5 py-3">Нэр</th>
              <th className="px-5 py-3">Имэйл</th>
              <th className="px-5 py-3">Утас</th>
              <th className="px-5 py-3">Үүрэг</th>
              <th className="px-5 py-3">Захиалга</th>
              <th className="px-5 py-3">Бүртгэгдсэн</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--border)/.2)]">
                <td className="px-5 py-3 font-semibold">
                  {u.firstName} {u.lastName}
                  {u.vipMember && <Sparkles className="inline w-3.5 h-3.5 text-gold-500 ml-1.5" />}
                </td>
                <td className="px-5 py-3 text-[rgb(var(--muted))]">{u.email}</td>
                <td className="px-5 py-3 text-[rgb(var(--muted))]">{u.phone ?? "—"}</td>
                <td className="px-5 py-3"><span className="pill pill-active">{u.role}</span></td>
                <td className="px-5 py-3">{u._count.bookings}</td>
                <td className="px-5 py-3 text-xs text-[rgb(var(--muted))]">{new Date(u.createdAt).toLocaleDateString("mn-MN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
