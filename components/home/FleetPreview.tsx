import CarCard from "@/components/cars/CarCard";
import { prisma } from "@/lib/prisma";
import FleetHeader from "./FleetHeader";

export const dynamic = "force-dynamic";

export default async function FleetPreview() {
  let cars: any[] = [];
  try {
    cars = await prisma.car.findMany({
      where: { available: true },
      include: { images: true, reviews: { select: { rating: true } } },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("FleetPreview DB error (build without DATABASE_URL):", e);
    cars = [];
  }

  return (
    <section id="vehicles" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FleetHeader />

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
      </div>
    </section>
  );
}
