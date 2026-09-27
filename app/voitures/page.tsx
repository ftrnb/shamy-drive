import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarCard from "@/components/cars/CarCard";
import { prisma } from "@/lib/prisma";
import VoituresHeader from "@/components/voitures/VoituresHeader";
import VoituresFilters, { VoituresAvailable, VoituresEmpty, ActiveChips } from "@/components/voitures/VoituresFilters";

interface SearchParams {
  brand?: string;
  category?: string;
  transmission?: string;
  fuel?: string;
  seats?: string;
  maxPrice?: string;
  q?: string;
  nl?: string;
  startDate?: string;
  endDate?: string;
}

export const dynamic = "force-dynamic";

export default async function VoituresPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  const where: any = {};
  if (params.brand) where.brand = { contains: params.brand, mode: "insensitive" };
  if (params.category) where.category = { contains: params.category, mode: "insensitive" };
  if (params.transmission) where.transmission = params.transmission;
  if (params.fuel) where.fuel = params.fuel;
  if (params.seats) where.seats = parseInt(params.seats);
  if (params.maxPrice) where.pricePerDay = { ...where.pricePerDay, lte: parseInt(params.maxPrice) };
  if (params.q) where.OR = [{ brand: { contains: params.q, mode: "insensitive" } }, { model: { contains: params.q, mode: "insensitive" } }];

  if (params.nl) {
    const lower = params.nl.toLowerCase();
    if (lower.includes("automatique")) where.transmission = "AUTOMATIC";
    if (lower.includes("manuelle")) where.transmission = "MANUAL";
    if (lower.includes("diesel")) where.fuel = "DIESEL";
    if (lower.includes("essence")) where.fuel = "ESSENCE";
    const seatsMatch = lower.match(/(\d)\s*places?/);
    if (seatsMatch) where.seats = parseInt(seatsMatch[1]);
    const priceMatch = lower.match(/moins de\s*(\d+)/) || lower.match(/(\d+)\s*dh/);
    if (priceMatch) where.pricePerDay = { ...where.pricePerDay, lte: parseInt(priceMatch[1]) };
    const catMatch = lower.match(/\b(suv|berline|citadine|compacte)\b/);
    if (catMatch) where.category = { contains: catMatch[1], mode: "insensitive" };
  }

  let excludeIds: string[] = [];
  if (params.startDate && params.endDate) {
    const s = new Date(`${params.startDate}T00:00:00`);
    const e = new Date(`${params.endDate}T00:00:00`);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e > s) {
      try {
        const overlapping = await prisma.booking.findMany({
          where: { status: { in: ["PENDING", "CONFIRMED"] }, startDate: { lte: e }, endDate: { gte: s } },
          select: { carId: true },
        });
        excludeIds = [...new Set(overlapping.map((b) => b.carId))];
        if (excludeIds.length) where.id = { notIn: excludeIds };
      } catch (e) {
        console.error("VoituresPage overlapping DB error (build without DATABASE_URL):", e);
      }
    }
  }

  let cars: any[] = [];
  let dbError = false;
  try {
    cars = await prisma.car.findMany({
      where,
      include: { images: true, reviews: { select: { rating: true } } },
      orderBy: [{ available: "desc" }, { pricePerDay: "asc" }],
    });
  } catch (e) {
    console.error("VoituresPage DB error:", e);
    dbError = true;
    cars = [];
  }

  // Preserve chosen dates through detail → booking
  const dateQuery =
    params.startDate && params.endDate ? `?startDate=${params.startDate}&endDate=${params.endDate}` : "";

  return (
    <main id="contenu" className="min-h-screen bg-background pb-28 md:pb-10">
      <Navbar />
      <VoituresHeader />

      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
        <VoituresFilters
          q={params.q}
          category={params.category}
          transmission={params.transmission}
          fuel={params.fuel}
          maxPrice={params.maxPrice}
          nl={params.nl}
          startDate={params.startDate}
          endDate={params.endDate}
        />

        <VoituresAvailable startDate={params.startDate} endDate={params.endDate} count={cars.length} />

        <ActiveChips
          q={params.q}
          category={params.category}
          transmission={params.transmission}
          fuel={params.fuel}
          maxPrice={params.maxPrice}
          nl={params.nl}
          startDate={params.startDate}
          endDate={params.endDate}
        />

        {dbError ? (
          <div className="rounded-[28px] border border-error/30 bg-error-container/40 p-10 text-center">
            <p className="font-display text-[18px] font-bold text-error">Erreur de connexion à la base de données</p>
            <p className="mx-auto mt-2 max-w-md text-[13px] text-on-surface-variant">Vérifie ta configuration DATABASE_URL et assure-toi que ta base est en ligne.</p>
          </div>
        ) : cars.length === 0 ? (
          <VoituresEmpty />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car: any) => {
              const avg = car.reviews.length ? car.reviews.reduce((a: number, r: { rating: number }) => a + r.rating, 0) / car.reviews.length : null;
              return (
                <CarCard
                  key={car.id}
                  id={car.id}
                  brand={car.brand}
                  model={car.model}
                  category={car.category}
                  pricePerDay={car.pricePerDay}
                  image={car.images[0]?.url || "/cars/Loganblanche.png"}
                  transmission={car.transmission}
                  fuel={car.fuel}
                  seats={car.seats}
                  avgRating={avg}
                  available={car.available}
                  query={dateQuery}
                />
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
