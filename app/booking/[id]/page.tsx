import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { BookingDetail } from "./BookingDetail";

export const metadata = { title: "Захиалгын мэдээлэл — Sky Charter Mongolia" };

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16">
        <BookingDetail id={id} />
      </main>
      <Footer />
    </>
  );
}
