import { prisma } from "@/lib/prisma";
import CarAdminClient from "./CarAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminVoituresPage() {
  const cars = await prisma.car.findMany({ include: { images: true, _count: { select: { bookings: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-black uppercase">Véhicules — CRUD</h1>
      <p className="mt-1 text-sm text-zinc-500">{cars.length} véhicules en base</p>
      <div className="mt-6">
        <CarAdminClient cars={cars as any} />
      </div>
    </div>
  );
}
