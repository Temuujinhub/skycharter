import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = { title: "Холбоо барих — Sky Charter Mongolia" };

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-xs uppercase tracking-[.25em] text-gold-500 font-semibold mb-3">CONTACT</div>
          <h1 className="text-4xl md:text-6xl font-bold">Бидэнтэй холбогдох</h1>
          <p className="text-[rgb(var(--muted))] mt-4 max-w-xl">Захиалга, мэдээлэл авах, корпорейт гэрээ байгуулах хүсэлтээ дараах хаягаар илгээгээрэй.</p>

          <div className="grid lg:grid-cols-2 gap-10 mt-12">
            <div className="card p-7 space-y-6">
              <Item icon={<Phone className="w-5 h-5" />} title="Утас" value="+976 11 326 730" />
              <Item icon={<Mail className="w-5 h-5" />} title="И-мэйл" value="skychartermongolia@gmail.com" />
              <Item icon={<MapPin className="w-5 h-5" />} title="Хаяг" value="Чингис Хаан ОУНБ, Улаанбаатар, Монгол улс" />
              <Item icon={<Clock className="w-5 h-5" />} title="Цагийн хуваарь" value="24/7 ажиллана" />
            </div>
            <div className="card p-7">
              <h3 className="font-bold mb-4">Хүсэлт илгээх</h3>
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Таны хүсэлтийг хүлээн авлаа. (Демо)"); }}>
                <div>
                  <label className="label">Таны нэр</label>
                  <input className="input" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">И-мэйл</label>
                    <input className="input" type="email" required />
                  </div>
                  <div>
                    <label className="label">Утас</label>
                    <input className="input" />
                  </div>
                </div>
                <div>
                  <label className="label">Зурвас</label>
                  <textarea className="input min-h-[120px]" required />
                </div>
                <button className="btn btn-primary w-full">Илгээх</button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Item({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-navy-800 text-gold-400 grid place-items-center">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-[rgb(var(--muted))]">{title}</div>
        <div className="font-semibold mt-1">{value}</div>
      </div>
    </div>
  );
}
