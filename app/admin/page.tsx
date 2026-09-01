import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalCars, totalBookings, pending, totalUsers, revenueAgg, recent] = await Promise.all([
    prisma.car.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.booking.aggregate({ where: { status: { in: ["CONFIRMED", "COMPLETED"] } }, _sum: { totalPrice: true } }),
    prisma.booking.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { car: { select: { brand: true, model: true } }, user: { select: { name: true, email: true } } } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-black uppercase">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Vue d'ensemble Shamy Drive</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white p-6 border border-zinc-200">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Véhicules</p>
          <p className="mt-2 text-3xl font-black">{totalCars}</p>
        </div>
        <div className="bg-white p-6 border border-zinc-200">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Réservations</p>
          <p className="mt-2 text-3xl font-black">{totalBookings}</p>
        </div>
        <div className="bg-[#C1272D] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">En attente</p>
          <p className="mt-2 text-3xl font-black">{pending}</p>
        </div>
        <div className="bg-white p-6 border border-zinc-200">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Clients</p>
          <p className="mt-2 text-3xl font-black">{totalUsers}</p>
        </div>
        <div className="bg-[#0A0A0A] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Revenu confirmé</p>
          <p className="mt-2 text-2xl font-black">{revenueAgg._sum.totalPrice || 0} DH</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-zinc-200 p-6">
          <h2 className="text-sm font-black uppercase tracking-widest">Dernières réservations</h2>
          <div className="mt-4 space-y-3">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-bold">{r.car.brand} {r.car.model} • {r.user.name || r.user.email}</p>
                  <p className="text-xs text-zinc-500">{new Date(r.startDate).toLocaleDateString("fr-MA")} → {new Date(r.endDate).toLocaleDateString("fr-MA")} • {r.totalPrice} DH • {r.status}</p>
                </div>
                <Link href="/admin/reservations" className="text-xs font-bold text-[#C1272D]">Gérer</Link>
              </div>
            ))}
            {recent.length === 0 && <p className="text-sm text-zinc-500">Aucune réservation pour l'instant.</p>}
          </div>
        </div>

        <div className="bg-white border border-zinc-200 p-6">
          <h2 className="text-sm font-black uppercase tracking-widest">Actions rapides</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/admin/voitures" className="bg-[#0A0A0A] px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-white hover:bg-[#C1272D]">Gérer les véhicules</Link>
            <Link href="/admin/reservations" className="border border-zinc-300 px-5 py-4 text-center text-xs font-black uppercase tracking-widest hover:border-black">Gérer les réservations</Link>
            <p className="text-xs text-zinc-400">Astuce : utilisez Cloudinary pour uploader de nouvelles photos de voitures sans passer par le code.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
