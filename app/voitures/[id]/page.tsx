import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarDetailContent from "@/components/voitures/CarDetailContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const car = await prisma.car.findUnique({ where: { id }, include: { images: true } });
    if (!car) return { title: "Véhicule introuvable" };
    return { title: `${car.brand} ${car.model} — ${car.pricePerDay} DH/j | Shamy Drive` };
  } catch {
    return { title: "Véhicule — Shamy Drive" };
  }
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let car: any = null;
  try {
    car = await prisma.car.findUnique({
      where: { id },
      include: { images: true, reviews: { include: { user: { select: { name: true } } } } },
    });
  } catch (e) {
    console.error("CarDetailPage DB error (build without DATABASE_URL):", e);
    notFound();
  }
  if (!car) notFound();

  const avgRating = car.reviews.length ? car.reviews.reduce((a: number, r: { rating: number }) => a + r.rating, 0) / car.reviews.length : null;
  const validImages = car.images.filter((img: { url: string }) => img.url && img.url.trim() !== "");
  const whatsappMsg = `Bonjour Shamy Drive 👋\n\nJe suis intéressé(e) par ${car.brand} ${car.model} (${car.pricePerDay} DH/j). Pouvez-vous me confirmer les disponibilités ? Merci.`;
  const waUrl = `https://wa.me/212661689659?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      <CarDetailContent car={car} validImages={validImages} avgRating={avgRating} waUrl={waUrl} />
      <Footer />
    </main>
  );
}
