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
      <h1 className="text-2xl font-black uppercase">Utilisateurs</h1>
      <p className="mt-1 text-sm text-zinc-500">{users.length} comptes</p>
      <div className="mt-6">
        <AdminUsersClient users={users as any} />
      </div>
    </div>
  );
}
