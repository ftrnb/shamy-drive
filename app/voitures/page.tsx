import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarCard from "@/components/cars/CarCard";
import { prisma } from "@/lib/prisma";
import VoituresHeader from "@/components/voitures/VoituresHeader";
import VoituresFilters, { VoituresAvailable, VoituresEmpty } from "@/components/voitures/VoituresFilters";

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
      const overlapping = await prisma.booking.findMany({
        where: { status: { in: ["PENDING", "CONFIRMED"] }, startDate: { lte: e }, endDate: { gte: s } },
        select: { carId: true },
      });
      excludeIds = [...new Set(overlapping.map((b) => b.carId))];
      if (excludeIds.length) where.id = { notIn: excludeIds };
    }
  }

  const cars = await prisma.car.findMany({
    where,
    include: { images: true, reviews: { select: { rating: true } } },
    orderBy: [{ available: "desc" }, { pricePerDay: "asc" }],
  });

  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      <VoituresHeader />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <VoituresFilters q={params.q} category={params.category} transmission={params.transmission} fuel={params.fuel} maxPrice={params.maxPrice} />

        <VoituresAvailable startDate={params.startDate} endDate={params.endDate} count={cars.length} />

        {cars.length === 0 ? (
          <VoituresEmpty />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => {
              const avg = car.reviews.length ? car.reviews.reduce((a, r) => a + r.rating, 0) / car.reviews.length : null;
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
