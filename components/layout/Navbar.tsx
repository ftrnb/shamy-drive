"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Car, Info, MessageCircleQuestion, Mail, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", key: "nav_home", icon: Home },
  { href: "/voitures", key: "nav_vehicles", icon: Car },
  { href: "/a-propos", key: "nav_about", icon: Info },
  { href: "/faq", key: "nav_faq", icon: MessageCircleQuestion },
  { href: "/contact", key: "nav_contact", icon: Mail },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }: any) => {
      if (!alive) return;
      setUser(data.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e: any, session: any) => {
      setUser(session?.user ?? null);
      if (_e === "SIGNED_IN" || _e === "SIGNED_OUT") router.refresh();
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [supabase, router]);

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const role = user?.app_metadata?.role || user?.user_metadata?.role;

  async function signOut() {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Navigation principale"
          className={cn(
            "mx-auto flex h-[64px] max-w-6xl items-center justify-between gap-3 rounded-full border pl-4 pr-2 transition-all duration-300",
            scrolled
              ? "border-outline-variant/60 bg-surface-container-lowest/90 shadow-m3-2 backdrop-blur-xl"
              : "border-white/10 bg-scrim/70 shadow-m3-1 backdrop-blur-xl"
          )}
        >
          <Link href="/" className="flex min-h-[48px] min-w-[48px] items-center gap-2 rounded-full px-1" aria-label="Shamy Drive — accueil">
            <span className={cn("flex h-10 items-center overflow-hidden rounded-full px-2", scrolled ? "bg-primary-container" : "bg-white")}>
              <Image src="/shamydrive.png" alt="Shamy Drive" width={132} height={36} className="h-7 w-auto object-contain" priority />
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-[44px] items-center rounded-full px-4 text-[14px] font-semibold transition-colors",
                    active
                      ? scrolled ? "bg-secondary-container text-on-secondary-container" : "bg-white/15 text-white"
                      : scrolled ? "text-on-surface-variant hover:bg-surface-container hover:text-on-surface" : "text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {t(l.key as any)}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="hidden md:block"><LanguageSwitcher dark={!scrolled} /></span>
            {!loading && user ? (
              <>
                <Link
                  href="/compte"
                  className={cn(
                    "hidden min-h-[48px] items-center gap-2 rounded-full px-4 text-[14px] font-bold sm:flex",
                    scrolled ? "bg-surface-container text-on-surface" : "bg-white/10 text-white"
                  )}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-[13px] font-bold text-on-primary-container">
                    {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "C").toUpperCase()}
                  </span>
                  <span className="max-w-[90px] truncate">{user.user_metadata?.full_name?.split(" ")[0] || t("nav_account" as any)}</span>
                </Link>
                {role === "ADMIN" && (
                  <Link href="/admin" aria-label="Admin" className="hidden h-12 w-12 items-center justify-center rounded-full bg-primary text-white transition hover:brightness-110 md:flex">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                )}
                <button onClick={signOut} aria-label="Déconnexion" className={cn("hidden h-12 w-12 items-center justify-center rounded-full transition sm:flex", scrolled ? "text-on-surface-variant hover:bg-surface-container" : "text-white/70 hover:bg-white/10 hover:text-white")}>
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login" className={cn("hidden min-h-[48px] items-center rounded-full px-4 text-[14px] font-semibold sm:flex", scrolled ? "text-primary hover:bg-primary-container/60" : "text-white/85 hover:bg-white/10 hover:text-white")}>
                  {t("nav_login" as any)}
                </Link>
                <Link href="/voitures" className="m3-state-layer hidden min-h-[48px] items-center rounded-full bg-primary px-6 text-[14px] font-bold text-white shadow-m3-1 transition hover:brightness-110 active:scale-[0.98] sm:flex">
                  {t("nav_book" as any)}
                </Link>
              </>
            ) : null}
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className={cn("flex h-12 w-12 items-center justify-center rounded-full transition", scrolled ? "bg-ink text-white" : "bg-white text-ink")}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[60] bg-scrim/50 backdrop-blur-sm lg:hidden" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-3 right-3 top-3 z-[61] flex w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-m3-4 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <div className="flex items-center justify-between bg-surface-container px-5 py-4">
                <Image src="/shamydrive.png" alt="Shamy Drive" width={120} height={32} className="h-8 w-auto" />
                <button onClick={() => setOpen(false)} aria-label="Fermer" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                {LINKS.map((l, i) => {
                  const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                  const Icon = l.icon;
                  return (
                    <motion.div key={l.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={cn("mb-1 flex min-h-[56px] items-center gap-4 rounded-2xl px-4 text-[15px] font-semibold", active ? "bg-secondary-container text-on-secondary-container" : "text-on-surface hover:bg-surface-container")}
                      >
                        <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", active ? "bg-white/60" : "bg-surface-container")}>
                          <Icon className="h-5 w-5" />
                        </span>
                        {t(l.key as any)}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="space-y-2 border-t border-outline-variant/50 bg-surface-container-low p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="flex justify-center pb-1 md:hidden"><LanguageSwitcher /></div>
                {user ? (
                  <>
                    <Link href="/compte" onClick={() => setOpen(false)} className="flex min-h-[56px] items-center gap-3 rounded-2xl bg-ink px-4 text-[15px] font-bold text-white">
                      <User className="h-5 w-5" /> Mon compte
                    </Link>
                    <button onClick={signOut} className="flex min-h-[48px] w-full items-center justify-center rounded-full text-[14px] font-semibold text-on-surface-variant">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setOpen(false)} className="flex min-h-[56px] items-center justify-center rounded-full border border-outline-variant text-[14px] font-bold">
                      Connexion
                    </Link>
                    <Link href="/voitures" onClick={() => setOpen(false)} className="flex min-h-[56px] items-center justify-center rounded-full bg-primary text-[14px] font-bold text-white">
                      Réserver
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
