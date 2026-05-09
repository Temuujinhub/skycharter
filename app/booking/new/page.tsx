import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { BookingWizard } from "./BookingWizard";
import { Suspense } from "react";

export const metadata = { title: "Шинэ захиалга — Sky Charter Mongolia" };

export default function NewBookingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16">
        <Suspense fallback={<div className="p-12 text-center">Уншиж байна…</div>}>
          <BookingWizard />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
