"use client";

import { useState } from "react";
import Link from "next/link";
import { XCircle, Star, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CompteClient({ bookings }: { bookings: any[] }) {
  const [items, setItems] = useState(bookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function cancel(id: string) {
    setLoadingId(id);
    setError(null);
    try {
      const res = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "CANCELLED" }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Annulation impossible"); return; }
      setItems((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
      setConfirmId(null);
    } finally {
      setLoadingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
        <p className="font-display text-[20px] font-bold">Aucune réservation</p>
        <p className="mx-auto mt-2 max-w-sm text-[14px] text-on-surface-variant">Parcourez la flotte et réservez votre première voiture.</p>
        <Link href="/voitures" className="mt-6 inline-flex min-h-[52px] items-center rounded-full bg-primary px-7 text-[14px] font-bold text-white">Voir les véhicules</Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="rounded-2xl bg-error-container/60 px-4 py-3 text-[13px] font-semibold text-error">{error}</p>}
      {items.map((b) => (
        <div key={b.id} className="flex flex-col gap-4 rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-m3-1 sm:flex-row sm:items-center">
          <div className="img-fade h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:w-44">
            <img src={b.car.images[0]?.url || "/cars/Loganblanche.png"} alt={b.car.model} className="h-full w-full object-contain p-2" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-bold uppercase tracking-widest text-primary">{b.car.brand} {b.car.model} • {b.car.category}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[14px] font-bold"><CalendarDays className="h-4 w-4 text-primary" /> Du {new Date(b.startDate).toLocaleDateString("fr-MA")} au {new Date(b.endDate).toLocaleDateString("fr-MA")} • {b.totalPrice} DH</p>
            <p className="mt-1 text-[12px] text-on-surface-variant">Réf {b.id.slice(0, 8).toUpperCase()} • {b.pickupLocation ? `${b.pickupLocation} → ${b.dropoffLocation}` : ""}</p>
            <span className={cn("mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-bold", b.status === "CONFIRMED" ? "bg-success-container text-on-success-container" : b.status === "CANCELLED" ? "bg-surface-container text-on-surface-variant" : "bg-tertiary-container text-on-tertiary-container")}>{b.status}</span>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link href={`/voitures/${b.car.id}`} className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-outline-variant px-5 text-[13px] font-bold">Voir véhicule</Link>
            {(b.status === "PENDING" || b.status === "CONFIRMED") && (
              confirmId === b.id ? (
                <div className="flex gap-2">
                  <button onClick={() => cancel(b.id)} disabled={loadingId === b.id} className="inline-flex min-h-[48px] items-center rounded-full bg-error px-5 text-[13px] font-bold text-white disabled:opacity-50">{loadingId === b.id ? "..." : "Confirmer"}</button>
                  <button onClick={() => setConfirmId(null)} className="inline-flex min-h-[48px] items-center rounded-full bg-surface-container px-5 text-[13px] font-bold">Garder</button>
                </div>
              ) : (
                <button onClick={() => setConfirmId(b.id)} className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-error-container/60 px-5 text-[13px] font-bold text-error transition hover:bg-error hover:text-white">
                  <XCircle className="h-4 w-4" /> Annuler
                </button>
              )
            )}
            {b.status === "COMPLETED" && (
              <Link href={`/voitures/${b.car.id}#avis`} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-on-surface-variant hover:text-ink"><Star className="h-4 w-4" /> Laisser un avis</Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
