"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Home, Car, Info, MessageCircleQuestion, Mail, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
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
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);
  const openRef = useRef(open);
  openRef.current = open;
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const supabase = useMemo(() => createClient(), []);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // App-like auto-hide: slide away on scroll down, return on scroll up
      setNavHidden(!reduceMotion && y > lastY.current && y > 260 && !openRef.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion]);

  useEffect(() => {
    let alive = true;
    supabase.auth
      .getUser()
      .then(({ data }: any) => {
        if (!alive) return;
        setUser(data?.user ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = supabase.auth.onAuthStateChange((_e: any, session: any) => {
        if (!alive) return;
        setUser(session?.user ?? null);
        if (_e === "SIGNED_IN" || _e === "SIGNED_OUT") router.refresh();
      });
      subscription = data.subscription;
    } catch {
      /* auth unavailable — header stays usable */
    }
    return () => {
      alive = false;
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  // Close drawer on navigation…
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // …lock scroll while open, and auto-close if resized to desktop
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = "";
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

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
      <header className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-300 sm:px-5 sm:pt-4 ${navHidden && !open ? "-translate-y-[120%]" : "translate-y-0"}`}>
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
                    "relative flex min-h-[44px] items-center rounded-full px-4 text-[14px] font-semibold transition-colors duration-200",
                    active
                      ? scrolled ? "text-on-secondary-container" : "text-white"
                      : scrolled ? "text-on-surface-variant hover:bg-surface-container hover:text-on-surface" : "text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {active && !reduceMotion && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", damping: 32, stiffness: 420 }}
                      className={cn("absolute inset-0 rounded-full", scrolled ? "bg-secondary-container" : "bg-white/15")}
                    />
                  )}
                  {active && reduceMotion && (
                    <span className={cn("absolute inset-0 rounded-full", scrolled ? "bg-secondary-container" : "bg-white/15")} />
                  )}
                  <span className="relative">{t(l.key as any)}</span>
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
            <span className="hidden sm:block"><ThemeToggle compact /></span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className={cn("flex h-12 w-12 items-center justify-center rounded-full transition active:scale-95 lg:hidden", scrolled ? "bg-ink text-white" : "bg-white text-ink")}
            >
              <motion.span
                key={open ? "close" : "open"}
                initial={reduceMotion ? false : { rotate: -70, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[60] bg-scrim/50 backdrop-blur-sm lg:hidden" />
            <motion.div
              id="menu-mobile"
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
                <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high transition active:scale-95">
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
                        className={cn("group/mitem mb-1 flex min-h-[56px] items-center gap-4 rounded-2xl px-4 text-[15px] font-semibold transition-all duration-200 active:scale-[0.99]", active ? "bg-secondary-container text-on-secondary-container" : "text-on-surface hover:translate-x-1 hover:bg-surface-container")}
                      >
                        <span className={cn("flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 group-hover/mitem:scale-110", active ? "bg-white/60" : "bg-surface-container")}>
                          <Icon className="h-5 w-5" />
                        </span>
                        {t(l.key as any)}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="space-y-2 border-t border-outline-variant/50 bg-surface-container-low p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between gap-2 pb-1">
                  <div className="md:hidden"><LanguageSwitcher /></div>
                  <ThemeToggle compact />
                </div>
                {user ? (
                  <>
                    <Link href="/compte" onClick={() => setOpen(false)} className="flex min-h-[56px] items-center gap-3 rounded-2xl bg-ink px-4 text-[15px] font-bold text-white">
                      <User className="h-5 w-5" /> Mon compte
                    </Link>
                    <button type="button" onClick={signOut} className="flex min-h-[48px] w-full items-center justify-center rounded-full text-[14px] font-semibold text-on-surface-variant transition active:scale-[0.98]">
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
