"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0A0A0A] text-zinc-300">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Image src="/shamydrive.png" alt="Shamy Drive" width={180} height={56} className="h-12 w-auto object-contain" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">{t("footer_tagline")}</p>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center border border-white/10 hover:border-[#C1272D] hover:text-[#C1272D] transition"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center border border-white/10 hover:border-[#C1272D] hover:text-[#C1272D] transition"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{t("footer_nav")}</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/voitures" className="hover:text-white transition">{t("nav_vehicles")}</Link></li>
              <li><Link href="/a-propos" className="hover:text-white transition">{t("nav_about")}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">{t("nav_faq")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t("nav_contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{t("footer_legal")}</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/faq" className="hover:text-white transition">{t("footer_terms")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t("footer_mentions")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t("footer_privacy")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{t("footer_contact")}</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-2 text-zinc-400"><MapPin className="h-4 w-4 text-[#C1272D]" /> {t("footer_delivery")}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#C1272D]" /> <a href="https://wa.me/212661689659" target="_blank" className="hover:text-white">+212 6 61 68 96 59</a></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#C1272D]" /> contact@shamydrive.ma</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Shamy Drive — {t("footer_rights")}</p>
          <p className="flex items-center gap-2">{t("footer_pay")}</p>
        </div>
      </div>
    </footer>
  );
}
