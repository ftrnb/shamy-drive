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
      <h1 className="font-display text-[28px] font-bold tracking-tight">Véhicules</h1>
      <p className="mt-1 text-[14px] text-on-surface-variant">{dbError ? "Erreur de connexion" : `${cars.length} véhicules en base`}</p>

      {dbError ? (
        <div className="mt-6 rounded-[24px] border border-error/30 bg-error-container/40 p-6 text-error">
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
