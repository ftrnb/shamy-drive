"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, XCircle, Star } from "lucide-react";

export default function CompteClient({ bookings }: { bookings: any[] }) {
  const [items, setItems] = useState(bookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function cancel(id: string) {
    if (!confirm("Annuler cette réservation ? Gratuit jusqu'à 48h avant départ.")) return;
    setLoadingId(id);
    try {
      const res = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "CANCELLED" }) });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Annulation impossible");
        return;
      }
      setItems((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
    } finally {
      setLoadingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="border border-zinc-200 bg-white p-10 text-center">
        <p className="text-lg font-black uppercase">Aucune réservation</p>
        <p className="mt-2 text-sm text-zinc-500">Parcourez la flotte et réservez votre première voiture.</p>
        <Link href="/voitures" className="mt-6 inline-block bg-[#C1272D] px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-black">Voir les véhicules</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((b) => (
        <div key={b.id} className="flex flex-col gap-4 border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center">
          <img src={b.car.images[0]?.url || "/cars/Loganblanche.png"} alt={b.car.model} className="h-28 w-44 object-contain bg-zinc-50 p-2" />
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-[#C1272D]">{b.car.brand} {b.car.model} • {b.car.category}</p>
            <p className="mt-1 text-sm font-bold">
              Du {new Date(b.startDate).toLocaleDateString("fr-MA")} au {new Date(b.endDate).toLocaleDateString("fr-MA")} • {b.totalPrice} DH
            </p>
            <p className="mt-1 text-xs text-zinc-500">Réf {b.id.slice(0, 8).toUpperCase()} • Créée le {new Date(b.createdAt).toLocaleDateString("fr-MA")} {b.pickupLocation ? `• ${b.pickupLocation} → ${b.dropoffLocation}` : ""}</p>
            <p className="mt-1 text-xs text-zinc-500">{b.pickupTime ? `${b.pickupTime} → ${b.dropoffTime}` : ""} {b.identityDocumentUrl ? <a href={b.identityDocumentUrl} target="_blank" className="ml-2 font-bold text-[#C1272D] underline">Voir CIN</a> : <span className="ml-2 text-red-600">Pièce manquante</span>}</p>
            <span className={`mt-2 inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest ${b.status === "CONFIRMED" ? "bg-green-100 text-green-700" : b.status === "CANCELLED" ? "bg-zinc-100 text-zinc-500" : b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-zinc-900 text-white"}`}>{b.status}</span>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link href={`/voitures/${b.car.id}`} className="border border-zinc-200 px-5 py-3 text-center text-xs font-bold uppercase tracking-wider hover:border-black">Voir véhicule</Link>
            {(b.status === "PENDING" || b.status === "CONFIRMED") && (
              <button onClick={() => cancel(b.id)} disabled={loadingId === b.id} className="inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-[#C1272D] hover:bg-[#C1272D] hover:text-white border border-[#C1272D] transition disabled:opacity-50">
                <XCircle className="h-4 w-4" /> {loadingId === b.id ? "..." : "Annuler"}
              </button>
            )}
            {b.status === "COMPLETED" && (
              <Link href={`/voitures/${b.car.id}#avis`} className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-black"><Star className="h-4 w-4" /> Laisser un avis</Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
