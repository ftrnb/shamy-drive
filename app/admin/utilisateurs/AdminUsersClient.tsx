"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminUsersClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleRole(user: any) {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Passer ${user.email} en ${newRole} ?`)) return;
    setLoadingId(user.id);
    const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id, role: newRole }) });
    const data = await res.json();
    setLoadingId(null);
    if (!res.ok) {
      alert(data.error || "Erreur");
      return;
    }
    router.refresh();
  }

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3 text-left">Utilisateur</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Rôle</th>
            <th className="px-4 py-3 text-left">Réservations</th>
            <th className="px-4 py-3 text-left">Créé</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-zinc-100">
              <td className="px-4 py-3 font-bold">{u.name || "—"}</td>
              <td className="px-4 py-3 text-zinc-600">{u.email}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 text-[10px] font-black uppercase ${u.role === "ADMIN" ? "bg-[#C1272D] text-white" : "bg-zinc-100 text-zinc-700"}`}>{u.role}</span></td>
              <td className="px-4 py-3">{u._count.bookings}</td>
              <td className="px-4 py-3 text-zinc-500">{new Date(u.createdAt).toLocaleDateString("fr-MA")}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => toggleRole(u)} disabled={loadingId === u.id} className="border border-zinc-300 px-3 py-1.5 text-xs font-bold hover:border-black disabled:opacity-50">
                  {u.role === "ADMIN" ? "Rétrograder" : "Promouvoir"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
