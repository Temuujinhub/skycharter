import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/marketing/Hero";
import { FleetShowcase } from "@/components/marketing/FleetShowcase";
import { PopularRoutes } from "@/components/marketing/PopularRoutes";
import { EmptyLegStrip } from "@/components/marketing/EmptyLegStrip";
import { WhyUs } from "@/components/marketing/WhyUs";

export default function HomePage() {
  return (
    <>
      <Navbar transparent />
      <main>
        <Hero />
        <FleetShowcase />
        <PopularRoutes />
        <EmptyLegStrip />
        <WhyUs />
      </main>
      <Footer />
    </>
  );
}
