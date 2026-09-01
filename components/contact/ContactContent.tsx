"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import ContactForm from "./ContactForm";

export default function ContactContent() {
  const { t } = useLanguage();
  return (
    <>
      <div className="bg-[#0A0A0A] px-6 pb-12 pt-28 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#C1272D]">{t("contact_badge")}</p>
          <h1 className="mt-3 text-4xl font-black uppercase">{t("contact_title")}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">{t("contact_desc")}</p>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="border border-zinc-200 p-6">
            <h2 className="text-sm font-black uppercase tracking-widest">{t("contact_coords")}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#C1272D]" /> Agadir, Maroc — Livraison aéroport Al Massira, hôtels, domicile</li>
              <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-[#C1272D]" /> <a href="https://wa.me/212661689659" className="font-bold hover:text-[#C1272D]">{t("contact_phone_full")}</a></li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-[#C1272D]" /> contact@shamydrive.ma</li>
              <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-[#C1272D]" /> 7j/7 — 08:00 à 22:00 (assistance 24/7 pour clients en cours)</li>
            </ul>
          </div>

          <div className="border border-zinc-200 bg-zinc-50 p-6">
            <h3 className="text-sm font-black uppercase">{t("contact_hours")}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{t("contact_hours_desc")}</p>
          </div>

          <div className="aspect-[16/9] overflow-hidden border border-zinc-200 bg-zinc-100">
            <iframe title="Agadir" src="https://maps.google.com/maps?q=Agadir&t=&z=12&ie=UTF8&iwloc=&output=embed" className="h-full w-full border-0" loading="lazy" />
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
