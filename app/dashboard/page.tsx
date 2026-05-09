import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CustomerDashboard } from "./CustomerDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Миний нислэгүүд — Sky Charter Mongolia" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin?callbackUrl=/dashboard");
  if (session.user.role === "ADMIN") redirect("/admin");
  if (session.user.role === "PILOT") redirect("/crew");
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16">
        <CustomerDashboard />
      </main>
      <Footer />
    </>
  );
}
