import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReservationClient from "./ReservationClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReservationHeader from "@/components/reservation/ReservationHeader";

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
    <main className="min-h-screen bg-zinc-100">
      <Navbar />
      <ReservationHeader car={car} id={id} />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ReservationClient car={car as any} initialStartDate={sp.startDate || ""} initialEndDate={sp.endDate || ""} />
      </section>
      <Footer />
    </main>
  );
}
