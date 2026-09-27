import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReservationClient from "./ReservationClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReservationHeader from "@/components/reservation/ReservationHeader";
import ScrollProgress from "@/components/ui/ScrollProgress";

export const dynamic = "force-dynamic";

export default async function ReservationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ startDate?: string; endDate?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  let car: any = null;
  try {
    car = await prisma.car.findUnique({ where: { id }, include: { images: true } });
  } catch (e) {
    console.error("ReservationPage DB error (build without DATABASE_URL):", e);
    notFound();
  }
  if (!car) notFound();

  return (
    <main id="contenu" className="min-h-screen bg-background pb-28 md:pb-10">
      <Navbar />
      <ScrollProgress />
      <ReservationHeader car={car} id={id} />
      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
        <ReservationClient car={car as any} initialStartDate={sp.startDate || ""} initialEndDate={sp.endDate || ""} />
      </section>
      <Footer />
    </main>
  );
}
