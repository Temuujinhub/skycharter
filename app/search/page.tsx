import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { SearchClient } from "./SearchClient";
import { Suspense } from "react";

export const metadata = { title: "Хайлт — Sky Charter Mongolia" };

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Suspense fallback={<div className="p-12 text-center">Уншиж байна…</div>}>
          <SearchClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
