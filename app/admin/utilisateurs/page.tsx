import { prisma } from "@/lib/prisma";
import AdminUsersClient from "./AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { bookings: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-[28px] font-bold tracking-tight">Utilisateurs</h1>
      <p className="mt-1 text-[14px] text-on-surface-variant">{users.length} comptes</p>
      <div className="mt-6">
        <AdminUsersClient users={users as any} />
      </div>
    </div>
  );
}
