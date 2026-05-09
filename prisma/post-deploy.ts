// Idempotent post-deploy script: updates aircraft photos + tail numbers to match
// the current Sky Charter Mongolia branding. Safe to run on every deploy.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates: Array<{ matchModel: RegExp; tailNumber: string; imageUrl: string }> = [
  {
    matchModel: /Cessna/i,
    tailNumber: "JU-3999",
    imageUrl: "/images/aircraft-cessna.jpg",
  },
  {
    matchModel: /H145|Airbus/i,
    tailNumber: "JU-6999",
    imageUrl: "/images/aircraft-h145.jpg",
  },
];

async function main() {
  const all = await prisma.aircraft.findMany();
  for (const a of all) {
    const u = updates.find((x) => x.matchModel.test(a.model));
    if (!u) continue;
    await prisma.aircraft.update({
      where: { id: a.id },
      data: { tailNumber: u.tailNumber, imageUrl: u.imageUrl },
    });
    console.log(`✅ ${a.model} → ${u.tailNumber} ${u.imageUrl}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
