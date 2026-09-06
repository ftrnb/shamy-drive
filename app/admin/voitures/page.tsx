import { prisma } from "@/lib/prisma";
import CarAdminClient from "./CarAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminVoituresPage() {
  let cars: any[] = [];
  let dbError = false;
  try {
    cars = await prisma.car.findMany({ include: { images: true, _count: { select: { bookings: true } } }, orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("AdminVoituresPage DB error:", e);
    dbError = true;
  }

  return (
    <div>
      <h1 className="text-2xl font-black uppercase">Véhicules — CRUD</h1>
      <p className="mt-1 text-sm text-zinc-500">{dbError ? "Erreur de connexion" : `${cars.length} véhicules en base`}</p>

      {dbError ? (
        <div className="mt-6 border border-red-200 bg-red-50 p-6 text-red-800">
          Vérifie ton <strong>DATABASE_URL</strong>. Prisma n'arrive pas à se connecter.
        </div>
      ) : (
        <div className="mt-6">
          <CarAdminClient cars={cars as any} />
        </div>
      )}
    </div>
  );
}
