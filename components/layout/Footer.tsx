"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Reveal from "@/components/ui/Reveal";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-14 md:pb-14 lg:px-8">
        {/* CTA card */}
        <Reveal>
        <div className="group flex flex-col gap-5 rounded-[28px] bg-primary p-7 transition-shadow duration-300 hover:shadow-m3-4 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-widest text-white/70">Agadir • Livraison aéroport</p>
            <h3 className="mt-2 font-display text-[26px] font-bold leading-tight sm:text-[32px]">Besoin d’une voiture cette semaine ?</h3>
            <p className="mt-2 max-w-md text-[14px] leading-6 text-white/80">Prix nets en DH, kilométrage illimité, paiement à la livraison.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
            <Link href="/voitures" className="group/link inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-7 text-[14px] font-bold text-ink transition hover:bg-surface-container-low active:scale-[0.98]">
              Voir les voitures <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
            <a href="https://wa.me/212661689659" target="_blank" rel="noopener" className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/30 px-7 text-[14px] font-bold text-white transition hover:bg-white/10 active:scale-[0.98]">
              WhatsApp
            </a>
          </div>
        </div>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Image src="/shamydrive.png" alt="Shamy Drive" width={168} height={48} className="h-10 w-auto rounded-xl bg-white px-3 py-1.5" />
            <p className="mt-4 max-w-xs text-[14px] leading-6 text-white/60">{t("footer_tagline" as any)}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-semibold text-white/80">
              <Clock className="h-4 w-4" /> 7j/7 • 08:00–22:00
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/50">{t("footer_nav" as any)}</h4>
            <ul className="mt-4 space-y-1 text-[14px]">
              {[
                ["/voitures", t("nav_vehicles" as any)],
                ["/a-propos", t("nav_about" as any)],
                ["/faq", t("nav_faq" as any)],
                ["/contact", t("nav_contact" as any)],
              ].map(([href, label]) => (
                <li key={href as string}>
                  <Link href={href as string} className="link-underline inline-flex min-h-[40px] items-center px-1 text-white/75 transition hover:text-white">{label as string}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/50">{t("footer_legal" as any)}</h4>
            <ul className="mt-4 space-y-1 text-[14px]">
              <li><Link href="/faq" className="inline-flex min-h-[40px] items-center text-white/75 hover:text-white">{t("footer_terms" as any)}</Link></li>
              <li><Link href="/faq" className="inline-flex min-h-[40px] items-center text-white/75 hover:text-white">{t("footer_privacy" as any)}</Link></li>
              <li><Link href="/contact" className="inline-flex min-h-[40px] items-center text-white/75 hover:text-white">{t("footer_mentions" as any)}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/50">{t("footer_contact" as any)}</h4>
            <ul className="mt-4 space-y-3 text-[14px]">
              <li className="flex items-start gap-2.5 text-white/75"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tertiary-container" /> Agadir, Maroc — livraison aéroport</li>
              <li><a href="https://wa.me/212661689659" target="_blank" className="flex items-center gap-2.5 font-semibold text-white hover:underline"><Phone className="h-4 w-4 text-tertiary-container" /> +212 6 61 68 96 59</a></li>
              <li className="flex items-center gap-2.5 text-white/75"><Mail className="h-4 w-4 text-tertiary-container" /> contact@shamydrive.ma</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shamy Drive — {t("footer_rights" as any)}</p>
          <p>{t("footer_pay" as any)}</p>
        </div>
      </div>
    </footer>
  );
}
