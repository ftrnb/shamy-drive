import CarCard from "@/components/cars/CarCard";
import { prisma } from "@/lib/prisma";
import FleetHeader from "./FleetHeader";
import Reveal from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest">
      <div className="aspect-[16/10] animate-pulse bg-surface-container" />
      <div className="space-y-2 p-5">
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-surface-container-high" />
        <div className="h-6 w-2/3 animate-pulse rounded-full bg-surface-container-high" />
        <div className="h-12 animate-pulse rounded-2xl bg-surface-container" />
      </div>
    </div>
  );
}

export default async function FleetPreview() {
  let cars: any[] = [];
  let dbError = false;
  try {
    cars = await prisma.car.findMany({
      where: { available: true },
      include: { images: true, reviews: { select: { rating: true } } },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("FleetPreview DB error:", e);
    dbError = true;
  }

  return (
    <section id="vehicles" className="mx-auto max-w-6xl px-3 py-12 sm:px-5" aria-label="Flotte">
      <FleetHeader />
      {dbError ? (
        <div className="rounded-[28px] border border-error/20 bg-error-container/40 p-8 text-center">
          <p className="font-display text-[18px] font-bold text-error">Impossible de charger la flotte</p>
          <p className="mt-1 text-[14px] text-on-surface-variant">Vérifie ta connexion, puis réessaie.</p>
        </div>
      ) : cars.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car: any, i: number) => {
            const avg = car.reviews.length ? car.reviews.reduce((a: number, r: { rating: number }) => a + r.rating, 0) / car.reviews.length : null;
            return (
              <Reveal key={car.id} delay={Math.min(i * 0.06, 0.3)}>
                <CarCard
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
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
