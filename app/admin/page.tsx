import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Car, CalendarCheck, Hourglass, Users, Wallet, ArrowUpRight } from "lucide-react";
import { CountUp } from "@/components/ui/Motion";

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

  const stats = [
    { icon: Car, label: "Véhicules", value: totalCars, suffix: "", tone: "bg-primary-container text-on-primary-container" },
    { icon: CalendarCheck, label: "Réservations", value: totalBookings, suffix: "", tone: "bg-secondary-container text-on-secondary-container" },
    { icon: Hourglass, label: "En attente", value: pending, suffix: "", tone: "bg-tertiary-container text-on-tertiary-container" },
    { icon: Users, label: "Clients", value: totalUsers, suffix: "", tone: "bg-surface-container-high text-on-surface" },
    { icon: Wallet, label: "Revenu confirmé", value: revenueAgg._sum.totalPrice || 0, suffix: " DH", tone: "bg-ink text-white" },
  ];

  return (
    <div className="animate-m3-fade-up">
      <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[34px]">Dashboard</h1>
      <p className="mt-1 text-[14px] text-on-surface-variant">Vue d'ensemble Shamy Drive</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{ animationDelay: `${i * 0.06}s` }}
            className="animate-m3-fade-up rounded-[24px] border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-m3-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-m3-2"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-110 hover:-rotate-6 ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</p>
            <p className="mt-1 font-display text-[30px] font-bold leading-none">
              <CountUp value={s.value} suffix={s.suffix} />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1 sm:p-7">
          <h2 className="font-display text-[17px] font-bold">Dernières réservations</h2>
          <div className="mt-4 space-y-1">
            {recent.map((r) => (
              <div key={r.id} className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition-colors duration-200 hover:bg-surface-container">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold">{r.car.brand} {r.car.model} • {r.user.name || r.user.email}</p>
                  <p className="mt-0.5 text-[12px] text-on-surface-variant">{new Date(r.startDate).toLocaleDateString("fr-MA")} → {new Date(r.endDate).toLocaleDateString("fr-MA")} • {r.totalPrice} DH • {r.status}</p>
                </div>
                <Link href="/admin/reservations" className="link-underline shrink-0 text-[13px] font-bold text-primary">Gérer</Link>
              </div>
            ))}
            {recent.length === 0 && <p className="rounded-2xl bg-surface-container px-4 py-6 text-center text-[13px] text-on-surface-variant">Aucune réservation pour l'instant.</p>}
          </div>
        </div>

        <div className="rounded-[28px] bg-ink p-6 text-white shadow-m3-2 sm:p-7">
          <h2 className="font-display text-[17px] font-bold">Actions rapides</h2>
          <div className="mt-4 grid gap-2">
            <Link href="/admin/voitures" className="group flex min-h-[56px] items-center justify-between rounded-full bg-primary px-6 text-[14px] font-bold text-white transition hover:brightness-110 active:scale-[0.98]">
              Gérer les véhicules <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/admin/reservations" className="flex min-h-[56px] items-center justify-center rounded-full bg-white/10 px-6 text-[14px] font-bold text-white transition hover:bg-white/15 active:scale-[0.98]">
              Gérer les réservations
            </Link>
            <p className="rounded-2xl bg-white/[0.06] px-4 py-3 text-[12px] leading-5 text-white/55">Astuce : uploade les photos via Cloudinary directement depuis la fiche véhicule.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
