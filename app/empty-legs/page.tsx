import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EmptyLegList } from "@/components/marketing/EmptyLegList";

export const metadata = { title: "Хоосон нислэг — Sky Charter Mongolia" };

export default function EmptyLegsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-xs uppercase tracking-[.25em] text-gold-500 font-semibold mb-3">EMPTY LEG</div>
          <h1 className="text-4xl md:text-6xl font-bold">Хоосон нислэгийн онцгой үнэ</h1>
          <p className="text-[rgb(var(--muted))] mt-3 max-w-2xl">Манай онгоцууд буцах хоосон явахдаа таныг тосон 50–75% хямдралтайгаар үйлчилнэ.</p>
        </div>
        <EmptyLegList />
      </main>
      <Footer />
    </>
  );
}
