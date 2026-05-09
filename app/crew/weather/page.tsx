import { prisma } from "@/lib/db";
import { CloudSun, Wind, Thermometer, Eye } from "lucide-react";

// Mock weather data per location
function mockWeather(seed: number) {
  const conditions = ["Цэлмэг", "Үүлшинэ", "Бороотой", "Цастай", "Шуургатай"];
  return {
    condition: conditions[seed % conditions.length],
    tempC: ((seed * 7) % 35) - 10,
    windKmh: 8 + (seed * 3) % 35,
    visibilityKm: 5 + (seed * 5) % 15,
  };
}

export default async function WeatherPage() {
  const locs = await prisma.location.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><CloudSun className="w-7 h-7 text-gold-400" /> Цаг агаарын мэдээ</h1>
        <p className="text-sm opacity-70 mt-1">Аэродром бүрийн өнөөгийн цаг агаар (демо).</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locs.map((l, i) => {
          const w = mockWeather(l.name.length + i);
          return (
            <div key={l.id} className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{l.name}</h3>
                  <div className="text-xs opacity-70">{l.nameEn}</div>
                </div>
                <CloudSun className="w-6 h-6 text-gold-400" />
              </div>
              <div className="text-4xl font-bold mt-3">{w.tempC}°C</div>
              <div className="text-sm opacity-80">{w.condition}</div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                <div className="flex items-center gap-1.5 opacity-80"><Wind className="w-3 h-3" /> {w.windKmh} км/ц</div>
                <div className="flex items-center gap-1.5 opacity-80"><Eye className="w-3 h-3" /> {w.visibilityKm} км</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
