import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculateQuote } from "../lib/pricing";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Sky Charter Mongolia database…");

  // Clean
  await prisma.payment.deleteMany();
  await prisma.flightLog.deleteMany();
  await prisma.passenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.emptyLeg.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.aircraft.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ────────────────────────────────────────────
  const adminPw = await bcrypt.hash("Admin@2026", 10);
  const pilotPw = await bcrypt.hash("Pilot@2026", 10);
  const demoPw = await bcrypt.hash("Demo@2026", 10);

  const [admin, pilot, demoUser] = await Promise.all([
    prisma.user.create({ data: { email: "admin@skycharter.mn", passwordHash: adminPw, firstName: "Bat", lastName: "Erdene", role: "ADMIN", phone: "+976 9911 0001" } }),
    prisma.user.create({ data: { email: "pilot@skycharter.mn", passwordHash: pilotPw, firstName: "Tumur", lastName: "Bayar", role: "PILOT", phone: "+976 9911 0002" } }),
    prisma.user.create({ data: { email: "demo@skycharter.mn", passwordHash: demoPw, firstName: "Saruul", lastName: "Munkh", role: "CUSTOMER", phone: "+976 9911 0003", vipMember: true } }),
  ]);

  console.log(`✅ Users: ${admin.email}, ${pilot.email}, ${demoUser.email}`);

  // ── Locations (Mongolia airports + helipads) ─────────
  const locations = await prisma.$transaction([
    prisma.location.create({ data: { name: "Чингис Хаан ОУНБ", nameEn: "Chinggis Khaan Intl.", lat: 47.6433, lng: 106.8200, landingFee: 250, type: "AIRPORT", iataCode: "UBN", region: "Төв" } }),
    prisma.location.create({ data: { name: "Буянт-Ухаа", nameEn: "Buyant-Ukhaa", lat: 47.8431, lng: 106.7669, landingFee: 200, type: "AIRPORT", iataCode: "ULN", region: "Төв" } }),
    prisma.location.create({ data: { name: "Хөвсгөл (Мөрөн)", nameEn: "Khuvsgul (Murun)", lat: 49.6633, lng: 100.0989, landingFee: 180, type: "AIRPORT", iataCode: "MXV", region: "Хангай" } }),
    prisma.location.create({ data: { name: "Далланзадгад", nameEn: "Dalanzadgad", lat: 43.5917, lng: 104.4300, landingFee: 200, type: "AIRPORT", iataCode: "DLZ", region: "Говь" } }),
    prisma.location.create({ data: { name: "Хонгорын элс", nameEn: "Khongoryn Els", lat: 43.7833, lng: 102.3000, landingFee: 120, type: "DIRT", region: "Говь" } }),
    prisma.location.create({ data: { name: "Хархорин", nameEn: "Kharkhorin", lat: 47.1986, lng: 102.8267, landingFee: 150, type: "AIRPORT", iataCode: "KHR", region: "Төв" } }),
    prisma.location.create({ data: { name: "Алтай таван богд", nameEn: "Altai Tavan Bogd", lat: 49.1167, lng: 87.7833, landingFee: 100, type: "DIRT", region: "Алтай" } }),
    prisma.location.create({ data: { name: "Оюу Толгой", nameEn: "Oyu Tolgoi", lat: 43.0033, lng: 106.8633, landingFee: 350, type: "AIRPORT", region: "Говь" } }),
    prisma.location.create({ data: { name: "Таван Толгой", nameEn: "Tavan Tolgoi", lat: 43.5756, lng: 105.4922, landingFee: 300, type: "AIRPORT", region: "Говь" } }),
    prisma.location.create({ data: { name: "Ховд", nameEn: "Khovd", lat: 47.9542, lng: 91.6281, landingFee: 200, type: "AIRPORT", iataCode: "HVD", region: "Алтай" } }),
    prisma.location.create({ data: { name: "Улаангом", nameEn: "Ulaangom", lat: 49.9733, lng: 92.0789, landingFee: 180, type: "AIRPORT", iataCode: "ULO", region: "Алтай" } }),
    prisma.location.create({ data: { name: "Чойбалсан", nameEn: "Choibalsan", lat: 48.1372, lng: 114.6461, landingFee: 200, type: "AIRPORT", iataCode: "COQ", region: "Зүүн" } }),
  ]);
  console.log(`✅ Locations: ${locations.length}`);
  const byName = (n: string) => locations.find((l) => l.name === n)!;

  // ── Aircraft ─────────────────────────────────────────
  const cessna = await prisma.aircraft.create({
    data: {
      tailNumber: "JU-3145",
      model: "Cessna 208B EX (Caravan)",
      capacity: 8,
      hourlyRate: 2000,
      cruiseSpeed: 344,
      rangeKm: 1700,
      cargoKg: 1300,
      status: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1583500178690-f7eb09e7c5b7?auto=format&fit=crop&w=1600&q=80",
      description: "Шороон зурваст буух чадвартай, Монголын нөхцөлд хамгийн тохиромжтой турбопроп онгоц.",
      descriptionEn: "Rugged turboprop able to land on dirt strips — perfect for Mongolian terrain.",
    },
  });
  const helo = await prisma.aircraft.create({
    data: {
      tailNumber: "JU-7705",
      model: "Airbus H145T2",
      capacity: 5,
      hourlyRate: 3200,
      cruiseSpeed: 240,
      rangeKm: 700,
      cargoKg: 600,
      status: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80",
      description: "Хос хөдөлгүүртэй, аюулгүй байдал өндөр, богино зайд буух чадвартай VIP нисдэг тэрэг.",
      descriptionEn: "Twin-engine VIP helicopter with high safety standards and short-field landing.",
    },
  });
  console.log(`✅ Aircraft: ${cessna.tailNumber}, ${helo.tailNumber}`);

  // ── Maintenance ───────────────────────────────────────
  const now = new Date();
  await prisma.maintenance.createMany({
    data: [
      { aircraftId: cessna.id, type: "100-цагийн үзлэг", scheduledAt: new Date(now.getTime() + 14 * 86400000) },
      { aircraftId: cessna.id, type: "Бүрэн засвар", scheduledAt: new Date(now.getTime() - 60 * 86400000), completedAt: new Date(now.getTime() - 55 * 86400000) },
      { aircraftId: helo.id, type: "Жилийн үзлэг", scheduledAt: new Date(now.getTime() + 30 * 86400000) },
    ],
  });

  // ── Empty legs ───────────────────────────────────────
  const elPairs = [
    { from: byName("Хөвсгөл (Мөрөн)"), to: byName("Чингис Хаан ОУНБ"), aircraft: cessna, day: 3, pct: 60 },
    { from: byName("Далланзадгад"), to: byName("Чингис Хаан ОУНБ"), aircraft: cessna, day: 5, pct: 55 },
    { from: byName("Хархорин"), to: byName("Чингис Хаан ОУНБ"), aircraft: helo, day: 2, pct: 70 },
  ];
  for (const e of elPairs) {
    const q = calculateQuote({
      from: { lat: e.from.lat, lng: e.from.lng, landingFee: Number(e.from.landingFee) },
      to: { lat: e.to.lat, lng: e.to.lng, landingFee: Number(e.to.landingFee) },
      aircraft: { hourlyRate: Number(e.aircraft.hourlyRate), cruiseSpeed: e.aircraft.cruiseSpeed },
    });
    await prisma.emptyLeg.create({
      data: {
        aircraftId: e.aircraft.id,
        fromLocId: e.from.id,
        toLocId: e.to.id,
        departureTime: new Date(now.getTime() + e.day * 86400000),
        originalPrice: q.total,
        discountedPrice: Math.round(q.total * (100 - e.pct) / 100),
        discountPct: e.pct,
        status: "AVAILABLE",
      },
    });
  }
  console.log(`✅ Empty legs: ${elPairs.length}`);

  // ── Bookings ─────────────────────────────────────────
  function makeBookingCode(seed: string) {
    return "SCM-" + seed.toUpperCase();
  }

  const bookingPlan: Array<{
    code: string; from: string; to: string; aircraft: typeof cessna;
    day: number; pax: number; status: "PENDING" | "CONFIRMED" | "COMPLETED";
    payment?: { method: "QPAY" | "CARD" | "INVOICE"; status: "PAID" | "PENDING" };
    passengers: { fullName: string; document?: string; weightKg?: number }[];
    isEmptyLeg?: boolean;
  }> = [
    {
      code: "DEMO01", from: "Чингис Хаан ОУНБ", to: "Хөвсгөл (Мөрөн)", aircraft: cessna, day: 7, pax: 4, status: "CONFIRMED",
      payment: { method: "CARD", status: "PAID" },
      passengers: [
        { fullName: "Saruul Munkh", document: "АБ12345678", weightKg: 70 },
        { fullName: "Bat-Erdene Tsogt", document: "ВЕ45612378", weightKg: 85 },
        { fullName: "Naran Bayar", document: "ЭЭ78912345", weightKg: 65 },
        { fullName: "Khorloo Dorj", document: "СН12378945", weightKg: 60 },
      ],
    },
    {
      code: "DEMO02", from: "Чингис Хаан ОУНБ", to: "Хонгорын элс", aircraft: cessna, day: 14, pax: 6, status: "CONFIRMED",
      payment: { method: "QPAY", status: "PAID" },
      passengers: Array.from({ length: 6 }, (_, i) => ({ fullName: `Зорчигч ${i + 1}`, weightKg: 70 })),
    },
    {
      code: "DEMO03", from: "Чингис Хаан ОУНБ", to: "Оюу Толгой", aircraft: helo, day: 2, pax: 3, status: "PENDING",
      payment: { method: "INVOICE", status: "PENDING" },
      passengers: [
        { fullName: "James Smith", document: "USA-A1234567", weightKg: 80 },
        { fullName: "Mary Johnson", document: "USA-B7654321", weightKg: 65 },
        { fullName: "Robert Lee", document: "USA-C9876543", weightKg: 75 },
      ],
    },
    {
      code: "DEMO04", from: "Чингис Хаан ОУНБ", to: "Хархорин", aircraft: cessna, day: -10, pax: 5, status: "COMPLETED",
      payment: { method: "CARD", status: "PAID" },
      passengers: Array.from({ length: 5 }, (_, i) => ({ fullName: `Аялагч ${i + 1}`, weightKg: 70 })),
    },
    {
      code: "DEMO05", from: "Чингис Хаан ОУНБ", to: "Алтай таван богд", aircraft: cessna, day: 21, pax: 7, status: "CONFIRMED",
      payment: { method: "QPAY", status: "PAID" },
      passengers: Array.from({ length: 7 }, (_, i) => ({ fullName: `Турист ${i + 1}`, weightKg: 75 })),
    },
  ];

  for (const p of bookingPlan) {
    const from = byName(p.from);
    const to = byName(p.to);
    const q = calculateQuote({
      from: { lat: from.lat, lng: from.lng, landingFee: Number(from.landingFee) },
      to: { lat: to.lat, lng: to.lng, landingFee: Number(to.landingFee) },
      aircraft: { hourlyRate: Number(p.aircraft.hourlyRate), cruiseSpeed: p.aircraft.cruiseSpeed },
    });
    const departureTime = new Date(now.getTime() + p.day * 86400000);
    const booking = await prisma.booking.create({
      data: {
        bookingCode: makeBookingCode(p.code),
        userId: demoUser.id,
        aircraftId: p.aircraft.id,
        departureLocId: from.id,
        arrivalLocId: to.id,
        departureTime,
        paxCount: p.pax,
        estFlightMinutes: q.flightMinutes,
        distanceKm: q.distanceKm,
        basePrice: q.basePrice,
        fees: q.fees,
        totalPrice: q.total,
        status: p.status,
        passengers: { create: p.passengers },
      },
    });

    if (p.payment) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: q.total,
          method: p.payment.method,
          status: p.payment.status,
          paidAt: p.payment.status === "PAID" ? new Date(departureTime.getTime() - 86400000) : null,
          txReference: p.payment.method + "-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
        },
      });
    }

    if (p.status === "COMPLETED") {
      await prisma.flightLog.create({
        data: {
          bookingId: booking.id,
          pilotId: pilot.id,
          engineStartAt: new Date(departureTime.getTime() - 10 * 60000),
          takeoffAt: new Date(departureTime.getTime()),
          landingAt: new Date(departureTime.getTime() + q.flightMinutes * 60000),
          engineStopAt: new Date(departureTime.getTime() + (q.flightMinutes + 5) * 60000),
          fuelUsedLiters: Math.round(q.flightMinutes * 4.2),
          notes: "Хэвийн нислэг.",
        },
      });
    }
  }
  console.log(`✅ Bookings: ${bookingPlan.length}`);

  console.log("🎉 Seed complete!");
  console.log("Login credentials:");
  console.log("  Admin:    admin@skycharter.mn / Admin@2026");
  console.log("  Pilot:    pilot@skycharter.mn / Pilot@2026");
  console.log("  Customer: demo@skycharter.mn  / Demo@2026");
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
