import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, Car, CalendarCheck, Users, ArrowLeft } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/voitures", label: "Voitures", icon: Car },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const role = user?.app_metadata?.role || user?.user_metadata?.role;
  if (role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <Link href="/admin" className="flex items-center gap-2.5 rounded-full py-1 pr-2 transition hover:opacity-85">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">S</span>
            <span className="font-display text-[15px] font-bold tracking-tight">Shamy Admin</span>
          </Link>
          <nav aria-label="Admin" className="no-scrollbar flex items-center gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white active:scale-95"
              >
                <n.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{n.label}</span>
              </Link>
            ))}
            <Link href="/" className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-[13px] font-bold text-white transition hover:bg-white/15 active:scale-95">
              <ArrowLeft className="h-4 w-4" /> Site
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-5 sm:py-8">{children}</main>
    </div>
  );
}
