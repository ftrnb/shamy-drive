"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, TriangleAlert } from "lucide-react";
import { Spinner, Stagger, StaggerItem } from "@/components/ui/Motion";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  CONFIRMED: "bg-success-container text-on-success-container",
  PENDING: "bg-tertiary-container text-on-tertiary-container",
  CANCELLED: "bg-surface-container-high text-on-surface-variant",
  COMPLETED: "bg-ink text-white",
};

export default function AdminBookingsClient({ bookings }: { bookings: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setLoadingId(id);
    try {
      const res = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast(`Réservation ${status}`, { desc: `#${id.slice(0, 8).toUpperCase()}` });
      router.refresh();
    } catch (err: any) {
      toast(err.message, { tone: "error" });
    } finally {
      setLoadingId(null);
    }
  }

  if (bookings.length === 0) return <p className="rounded-[24px] border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-10 text-center text-[13px] text-on-surface-variant">Aucune réservation dans cette catégorie.</p>;

  return (
    <Stagger className="space-y-3" gap={0.06}>
      {bookings.map((b) => (
        <StaggerItem key={b.id}>
        <div className="flex flex-col gap-3 rounded-[24px] border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-m3-1 transition-shadow duration-300 hover:shadow-m3-2 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold">{b.car.brand} {b.car.model} — {b.user.name || b.user.email}</p>
            <p className="mt-0.5 text-[12px] text-on-surface-variant">{b.user.email} • {new Date(b.startDate).toLocaleDateString("fr-MA")} → {new Date(b.endDate).toLocaleDateString("fr-MA")} • {b.totalPrice} DH</p>
            <p className="mt-1 text-[11px] text-outline">#{b.id.slice(0, 8).toUpperCase()} • {new Date(b.createdAt).toLocaleDateString("fr-MA")}{b.pickupLocation ? ` • ${b.pickupLocation} → ${b.dropoffLocation}` : ""}</p>
            {b.identityDocumentUrl ? (
              <a href={b.identityDocumentUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-bold text-primary">
                <FileText className="h-4 w-4" /> Voir CIN / Passeport
              </a>
            ) : (
              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-error-container/60 px-3 py-1 text-[11px] font-bold text-error"><TriangleAlert className="h-3.5 w-3.5" /> Pièce d'identité manquante</span>
            )}
            {b.notes && <p className="mt-1.5 rounded-2xl bg-surface-container px-3 py-2 text-[12px] italic text-on-surface-variant">Note : {b.notes}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest", STATUS_TONE[b.status] || "bg-surface-container text-on-surface-variant")}>
              {loadingId === b.id ? <Spinner className="h-3 w-3" /> : null}{b.status}
            </span>
            <select disabled={loadingId === b.id} defaultValue={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} aria-label="Statut" className="h-[44px] rounded-full border border-outline-variant bg-surface-container-lowest px-3 text-[12px] font-bold outline-none transition focus:border-primary disabled:opacity-50">
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
