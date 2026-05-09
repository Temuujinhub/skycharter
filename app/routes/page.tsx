import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PopularRoutes } from "@/components/marketing/PopularRoutes";

export const metadata = { title: "Чиглэлүүд — Sky Charter Mongolia" };

export default function RoutesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 mb-6">
          <div className="text-xs uppercase tracking-[.25em] text-gold-500 font-semibold mb-3">DESTINATIONS</div>
          <h1 className="text-4xl md:text-6xl font-bold">Алдартай чиглэлүүд</h1>
          <p className="text-[rgb(var(--muted))] mt-3 max-w-2xl">Хувийн нислэгээр Монголын хамгийн алслагдсан булангуудыг хэдхэн цагт нээж үзээрэй.</p>
        </div>
        <PopularRoutes />
      </main>
      <Footer />
    </>
  );
}
