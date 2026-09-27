"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import ContactForm from "./ContactForm";
import { Eyebrow } from "@/components/ui/M3";

export default function ContactContent() {
  const { t } = useLanguage();
  return (
    <>
      <div className="px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-ink p-7 text-white sm:p-10">
          <Eyebrow className="bg-white/10 text-white">{t("contact_badge")}</Eyebrow>
          <h1 className="mt-4 font-display text-[34px] font-bold leading-tight sm:text-[48px]">{t("contact_title")}</h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-7 text-white/65">{t("contact_desc")}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href="https://wa.me/212661689659" target="_blank" className="inline-flex min-h-[52px] items-center rounded-full bg-primary px-6 text-[14px] font-bold">WhatsApp — +212 6 61 68 96 59</a>
            <a href="mailto:contact@shamydrive.ma" className="inline-flex min-h-[52px] items-center rounded-full bg-white/10 px-6 text-[14px] font-bold">contact@shamydrive.ma</a>
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-4 px-3 py-6 sm:px-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1 sm:p-7">
            <h2 className="font-display text-[18px] font-bold">{t("contact_coords")}</h2>
            <ul className="mt-4 space-y-3 text-[14px]">
              <li className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-container"><MapPin className="h-5 w-5 text-on-primary-container" /></span><span>Agadir, Maroc — livraison aéroport Al Massira, hôtels, domicile</span></li>
              <li className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-success-container"><Phone className="h-5 w-5 text-on-success-container" /></span><a href="https://wa.me/212661689659" className="font-bold text-primary hover:underline">{t("contact_phone_full")}</a></li>
              <li className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-container"><Mail className="h-5 w-5 text-primary" /></span>contact@shamydrive.ma</li>
              <li className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-tertiary-container"><Clock className="h-5 w-5 text-on-tertiary-container" /></span>7j/7 — 08:00 à 22:00 (assistance 24/7 en location)</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest">
            <iframe title="Agadir" src="https://maps.google.com/maps?q=Agadir&t=&z=12&ie=UTF8&iwloc=&output=embed" className="aspect-[16/9] h-full w-full border-0" loading="lazy" />
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
