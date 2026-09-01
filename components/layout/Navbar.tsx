"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/language-context";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role as string | undefined;
  const { t } = useLanguage();

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <nav className="border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Image src="/shamydrive.png" alt="Shamy Drive" width={160} height={48} className="h-9 w-auto object-contain hidden sm:block" />
            <Image src="/shamydrive.png" alt="Shamy Drive" width={120} height={36} className="h-8 w-auto object-contain sm:hidden" />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-sm font-medium text-white hover:text-[#C1272D] transition">{t("nav_home")}</Link>
            <Link href="/voitures" className="text-sm font-medium text-zinc-300 hover:text-white transition">{t("nav_vehicles")}</Link>
            <Link href="/a-propos" className="text-sm font-medium text-zinc-300 hover:text-white transition">{t("nav_about")}</Link>
            <Link href="/faq" className="text-sm font-medium text-zinc-300 hover:text-white transition">{t("nav_faq")}</Link>
            <Link href="/contact" className="text-sm font-medium text-zinc-300 hover:text-white transition">{t("nav_contact")}</Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            {status === "authenticated" ? (
              <>
                <Link href="/compte" className="flex items-center gap-2 border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition">
                  <User className="h-4 w-4" />
                  {session.user?.name?.split(" ")[0] || t("nav_account")}
                </Link>
                {role === "ADMIN" && (
                  <Link href="/admin" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C1272D] hover:text-white">
                    <LayoutDashboard className="h-4 w-4" /> Admin
                  </Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-zinc-400 hover:text-white transition"><LogOut className="h-5 w-5" /></button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white">{t("nav_login")}</Link>
                <Link href="/voitures" className="bg-[#C1272D] px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition">{t("nav_book")}</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="flex h-10 w-10 items-center justify-center border border-white/10 text-white md:hidden" aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className={`overflow-hidden border-t border-white/10 transition-all md:hidden ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="space-y-1 px-5 py-4">
            <div className="flex justify-end pb-2"><LanguageSwitcher /></div>
            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-white hover:bg-white/5">{t("nav_home")}</Link>
            <Link href="/voitures" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-zinc-300 hover:text-white">{t("nav_vehicles")}</Link>
            <Link href="/a-propos" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-zinc-300 hover:text-white">{t("nav_about")}</Link>
            <Link href="/faq" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-zinc-300 hover:text-white">{t("nav_faq")}</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-zinc-300 hover:text-white">{t("nav_contact")}</Link>
            {status === "authenticated" ? (
              <>
                <Link href="/compte" onClick={() => setMobileOpen(false)} className="block border border-white/10 px-4 py-3 text-xs font-black uppercase text-white">Mon compte</Link>
                {role === "ADMIN" && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-xs font-bold text-[#C1272D]">Dashboard Admin</Link>}
                <button onClick={() => signOut()} className="w-full px-4 py-3 text-left text-sm text-zinc-400">Déconnexion</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block bg-[#C1272D] px-4 py-4 text-center text-xs font-black uppercase text-white">Connexion</Link>
            )}
            <Link href="/voitures" onClick={() => setMobileOpen(false)} className="block bg-[#C1272D] px-4 py-4 text-center text-xs font-black uppercase text-white mt-2">Réserver une voiture</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
