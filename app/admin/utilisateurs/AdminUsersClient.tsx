"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/Motion";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

export default function AdminUsersClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function toggleRole(user: any) {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setLoadingId(user.id);
    try {
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id, role: newRole }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setConfirmId(null);
      toast(`${user.email} → ${newRole}`);
      router.refresh();
    } catch (err: any) {
      toast(err.message, { tone: "error" });
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-[24px] border border-outline-variant/40 bg-surface-container-lowest shadow-m3-1">
      <table className="w-full text-[13px]">
        <thead className="bg-surface-container text-[11px] uppercase tracking-widest text-on-surface-variant">
          <tr>
            <th className="px-4 py-3.5 text-left font-bold">Utilisateur</th>
            <th className="px-4 py-3.5 text-left font-bold">Email</th>
            <th className="px-4 py-3.5 text-left font-bold">Rôle</th>
            <th className="px-4 py-3.5 text-left font-bold">Résas</th>
            <th className="px-4 py-3.5 text-left font-bold">Créé</th>
            <th className="px-4 py-3.5 text-right font-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="admin-row border-t border-outline-variant/40">
              <td className="px-4 py-3.5 font-bold">{u.name || "—"}</td>
              <td className="max-w-[220px] truncate px-4 py-3.5 text-on-surface-variant">{u.email}</td>
              <td className="px-4 py-3.5"><span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest", u.role === "ADMIN" ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant")}>{u.role}</span></td>
              <td className="px-4 py-3.5 font-bold">{u._count.bookings}</td>
              <td className="px-4 py-3.5 text-on-surface-variant">{new Date(u.createdAt).toLocaleDateString("fr-MA")}</td>
              <td className="px-4 py-3.5 text-right">
                {confirmId === u.id ? (
                  <span className="inline-flex gap-1.5">
                    <button type="button" onClick={() => toggleRole(u)} disabled={loadingId === u.id} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-primary px-3.5 text-[12px] font-bold text-white transition active:scale-95 disabled:opacity-50">
                      {loadingId === u.id ? <Spinner className="h-3.5 w-3.5" /> : null}Oui
                    </button>
                    <button type="button" onClick={() => setConfirmId(null)} className="inline-flex min-h-[40px] items-center rounded-full bg-surface-container px-3.5 text-[12px] font-bold transition active:scale-95">Non</button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setConfirmId(u.id)} disabled={loadingId === u.id} className="inline-flex min-h-[40px] items-center rounded-full border border-outline-variant px-3.5 text-[12px] font-bold transition hover:border-primary hover:text-primary active:scale-95 disabled:opacity-50">
                    {u.role === "ADMIN" ? "Rétrograder" : "Promouvoir"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
