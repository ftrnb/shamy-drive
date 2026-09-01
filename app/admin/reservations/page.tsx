import { prisma } from "@/lib/prisma";
import AdminBookingsClient from "./AdminBookingsClient";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const where: any = {};
  if (sp.status) where.status = sp.status;

  const bookings = await prisma.booking.findMany({
    where,
    include: { car: { select: { brand: true, model: true, pricePerDay: true } }, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-black uppercase">Réservations</h1>
      <p className="mt-1 text-sm text-zinc-500">{bookings.length} résultats</p>

      <div className="mt-4 flex gap-2">
        <a href="/admin/reservations" className={`px-4 py-2 text-xs font-bold border ${!sp.status ? "bg-black text-white border-black" : "bg-white border-zinc-300"}`}>Toutes</a>
        {["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((s) => (
          <a key={s} href={`/admin/reservations?status=${s}`} className={`px-4 py-2 text-xs font-bold border ${sp.status === s ? "bg-[#C1272D] text-white border-[#C1272D]" : "bg-white border-zinc-300"}`}>{s}</a>
        ))}
      </div>

      <div className="mt-6">
        <AdminBookingsClient bookings={bookings as any} />
      </div>
    </div>
  );
}
