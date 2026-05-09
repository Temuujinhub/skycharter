import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Plane, Award, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = { title: "Бидний тухай — Sky Charter Mongolia" };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <div className="text-xs uppercase tracking-[.25em] text-gold-500 font-semibold mb-3">ABOUT US</div>
          <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">Sky Charter Mongolia LLC — Монголын тэнгэрийн VIP үйлчилгээ</h1>
          <p className="text-[rgb(var(--muted))] mt-6 max-w-3xl text-lg">
            Манай компани нь Чингис Хаан болон Буянт-Ухаа олон улсын онгоцны буудлуудыг бааз болгон, Cessna 208B EX болон Airbus H145T2 онгоцоор хувийн болон захиалгат нислэгийн үйлчилгээг үзүүлдэг.
            Аялал жуулчлал, уул уурхай, эмнэлгийн яаралтай тусламж зэрэг олон төрлийн шаардлагад нийцсэн уян хатан, найдвартай шийдлийг санал болгож байна.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-5 lg:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5 pb-16">
          {[
            { icon: Plane, title: "2 онгоц", desc: "Cessna 208B EX + Airbus H145T2" },
            { icon: Award, title: "10+ жил", desc: "Зах зээлд тэргүүлэгч туршлага" },
            { icon: ShieldCheck, title: "Олон улсын стандарт", desc: "Аюулгүй байдлын баталгаа" },
            { icon: Sparkles, title: "VIP үйлчилгээ", desc: "Хувийн зөвлөх, тансаг тав тух" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="card p-7">
              <div className="w-12 h-12 rounded-xl bg-navy-800 text-gold-400 grid place-items-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm text-[rgb(var(--muted))] mt-1.5">{desc}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
