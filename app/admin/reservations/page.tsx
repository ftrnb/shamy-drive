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
      <h1 className="font-display text-[28px] font-bold tracking-tight">Réservations</h1>
      <p className="mt-1 text-[14px] text-on-surface-variant">{bookings.length} résultats</p>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <a href="/admin/reservations" className={`shrink-0 rounded-full border px-4 py-2.5 text-[12px] font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${!sp.status ? "border-transparent bg-ink text-white shadow-m3-1" : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-outline"}`}>Toutes</a>
        {["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((s) => (
          <a key={s} href={`/admin/reservations?status=${s}`} className={`shrink-0 rounded-full border px-4 py-2.5 text-[12px] font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${sp.status === s ? "border-transparent bg-primary text-white shadow-m3-1" : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-outline"}`}>{s}</a>
        ))}
      </div>

      <div className="mt-6">
        <AdminBookingsClient bookings={bookings as any} />
      </div>
    </div>
  );
}
