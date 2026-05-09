import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FleetShowcase } from "@/components/marketing/FleetShowcase";

export const metadata = { title: "Онгоцны парк — Sky Charter Mongolia" };

export default function FleetPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 mb-6">
          <div className="text-xs uppercase tracking-[.25em] text-gold-500 font-semibold mb-3">FLEET</div>
          <h1 className="text-4xl md:text-6xl font-bold">Манай агаарын хөлгийн парк</h1>
          <p className="text-[rgb(var(--muted))] mt-3 max-w-2xl">Cessna 208B EX болон Airbus H145T2 — Монголын газар нутгийн онцлогт зориулагдсан хамгийн дэвшилтэт онгоцууд.</p>
        </div>
        <FleetShowcase />
      </main>
      <Footer />
    </>
  );
}
