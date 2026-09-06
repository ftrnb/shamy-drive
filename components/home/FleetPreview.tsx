import CarCard from "@/components/cars/CarCard";
import { prisma } from "@/lib/prisma";
import FleetHeader from "./FleetHeader";

export const dynamic = "force-dynamic";

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
    cars = [];
  }

  return (
    <section id="vehicles" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FleetHeader />

        {dbError ? (
          <div className="mt-8 border border-red-100 bg-red-50/50 p-6 text-center text-red-600">
            <p className="text-sm font-bold">Impossible de charger la flotte (Erreur DB)</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  image={car.images[0]?.url || "/shamydrive.png"}
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
      </div>
    </section>
  );
}
