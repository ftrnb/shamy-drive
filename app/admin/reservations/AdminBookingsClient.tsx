"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminBookingsClient({ bookings }: { bookings: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setLoadingId(id);
    const res = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    const data = await res.json();
    setLoadingId(null);
    if (!res.ok) {
      alert(data.error || "Erreur");
      return;
    }
    router.refresh();
  }

  if (bookings.length === 0) return <p className="text-sm text-zinc-500">Aucune réservation dans cette catégorie.</p>;

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div key={b.id} className="flex flex-col gap-3 border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-sm font-black">{b.car.brand} {b.car.model} — {b.user.name || b.user.email}</p>
            <p className="text-xs text-zinc-500">{b.user.email} • {new Date(b.startDate).toLocaleDateString("fr-MA")} → {new Date(b.endDate).toLocaleDateString("fr-MA")} • {b.totalPrice} DH</p>
            <p className="mt-1 text-[10px] text-zinc-400">#{b.id.slice(0, 8).toUpperCase()} • {new Date(b.createdAt).toLocaleDateString("fr-MA")} {b.pickupLocation ? `• ${b.pickupLocation} → ${b.dropoffLocation}` : ""}</p>
            {b.identityDocumentUrl ? (
              <a href={b.identityDocumentUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#C1272D] hover:underline">
                📄 Voir CIN/Passeport
              </a>
            ) : (
              <span className="mt-1 inline-block text-xs text-red-600">⚠️ Pièce d'identité manquante</span>
            )}
            {b.notes && <p className="mt-1 text-xs italic text-zinc-500">Note: {b.notes}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${b.status === "CONFIRMED" ? "bg-green-600 text-white" : b.status === "PENDING" ? "bg-yellow-500 text-white" : b.status === "CANCELLED" ? "bg-zinc-300 text-zinc-700" : "bg-black text-white"}`}>{b.status}</span>
            <select disabled={loadingId === b.id} defaultValue={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className="border border-zinc-300 px-2 py-2 text-xs">
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
