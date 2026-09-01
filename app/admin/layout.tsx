import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="bg-[#0A0A0A] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-sm font-black tracking-[0.2em]">SHAMY ADMIN</Link>
          <nav className="flex gap-4 text-xs font-bold uppercase tracking-wider">
            <Link href="/admin" className="hover:text-[#C1272D]">Dashboard</Link>
            <Link href="/admin/voitures" className="hover:text-[#C1272D]">Voitures</Link>
            <Link href="/admin/reservations" className="hover:text-[#C1272D]">Réservations</Link>
            <Link href="/admin/utilisateurs" className="hover:text-[#C1272D]">Utilisateurs</Link>
            <Link href="/" className="text-zinc-400 hover:text-white">← Site</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
