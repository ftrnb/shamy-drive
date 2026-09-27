"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  if (pathname.startsWith("/admin") || pathname.startsWith("/reservation")) return null;

  const items = [
    { href: "/", label: t("nav_home" as any), icon: Home, active: pathname === "/" },
    { href: "/voitures", label: t("nav_vehicles" as any), icon: Car, active: pathname.startsWith("/voitures") },
    { href: "https://wa.me/212661689659", label: "WhatsApp", icon: MessageCircle, active: false, external: true },
  ];

  return (
    <nav aria-label="Navigation rapide" className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1 rounded-full border border-outline-variant/40 bg-surface-container-lowest/95 p-1.5 shadow-m3-3 backdrop-blur-xl">
        {items.map((it) => {
          const Icon = it.icon;
          const cls = cn(
            "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-full text-[11px] font-bold transition-all",
            it.active ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant active:bg-surface-container"
          );
          const inner = (
            <>
              <Icon className="h-5 w-5" />
              {it.label}
            </>
          );
          if ((it as any).external) {
            return <a key={it.label} href={it.href} target="_blank" rel="noopener" className={cls}>{inner}</a>;
          }
          return <Link key={it.href} href={it.href} aria-current={it.active ? "page" : undefined} className={cls}>{inner}</Link>;
        })}
      </div>
    </nav>
  );
}
