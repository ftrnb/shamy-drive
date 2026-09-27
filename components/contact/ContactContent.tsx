"use client";

import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Eyebrow } from "@/components/ui/M3";
import Reveal from "@/components/ui/Reveal";

const WA_NUMBER = "212661689659";

export default function ContactContent() {
  const { t, lang } = useLanguage();
  const waDirect = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    lang === "fr"
      ? "Bonjour Shamy Drive, j'ai une question sur une location."
      : "Hello Shamy Drive, I have a question about a rental."
  )}`;
  return (
    <>
      <div className="px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-ink p-7 text-white shadow-m3-3 sm:p-10">
          <Eyebrow className="bg-white/10 text-white">{t("contact_badge")}</Eyebrow>
          <h1 className="mt-4 font-display text-[34px] font-bold leading-tight sm:text-[48px]">{t("contact_title")}</h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-7 text-white/65">{t("contact_desc")}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={waDirect} target="_blank" rel="noopener" className="group inline-flex min-h-[52px] items-center gap-2 rounded-full bg-success px-6 text-[14px] font-bold text-white transition hover:brightness-110 active:scale-[0.98]">
              <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
              WhatsApp — +212 6 61 68 96 59
            </a>
            <a href="tel:+212661689659" className="inline-flex min-h-[52px] items-center rounded-full bg-white/10 px-6 text-[14px] font-bold text-white transition hover:bg-white/15 active:scale-[0.98]">
              {lang === "fr" ? "Appeler" : "Call"}
            </a>
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-4 px-3 py-6 sm:px-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <Reveal>
          <div className="rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1 transition-shadow duration-300 hover:shadow-m3-2 sm:p-7">
            <h2 className="font-display text-[18px] font-bold">{t("contact_coords")}</h2>
            <ul className="mt-4 space-y-3 text-[14px]">
              <li className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-container transition-transform duration-300 hover:scale-110 hover:-rotate-6"><MapPin className="h-5 w-5 text-on-primary-container" /></span><span>Agadir, Maroc — livraison aéroport Al Massira, hôtels, domicile</span></li>
              <li className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-success-container transition-transform duration-300 hover:scale-110 hover:-rotate-6"><Phone className="h-5 w-5 text-on-success-container" /></span><a href={waDirect} target="_blank" rel="noopener" className="font-bold text-primary hover:underline">{t("contact_phone_full")}</a></li>
              <li className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-tertiary-container transition-transform duration-300 hover:scale-110 hover:-rotate-6"><Clock className="h-5 w-5 text-on-tertiary-container" /></span>{lang === "fr" ? "7j/7 — 08:00 à 22:00 (assistance pendant la location)" : "7/7 — 8am to 10pm (assistance during rental)"}</li>
            </ul>
          </div>
          </Reveal>
          <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest transition-shadow duration-300 hover:shadow-m3-2">
            <iframe title="Agadir" src="https://maps.google.com/maps?q=Agadir&t=&z=12&ie=UTF8&iwloc=&output=embed" className="aspect-[16/9] h-full w-full border-0" loading="lazy" />
          </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
        <div className="flex h-fit flex-col rounded-[32px] bg-ink p-7 text-white shadow-m3-2 sm:p-8 lg:sticky lg:top-24">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold text-white/85">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success-container" />
            {lang === "fr" ? "Contact direct" : "Direct contact"}
          </p>
          <h2 className="mt-4 font-display text-[24px] font-bold leading-tight">
            {lang === "fr" ? "Pas de formulaire, parle à l'équipe." : "No forms — talk to the team."}
          </h2>
          <p className="mt-2 text-[14px] leading-7 text-white/65">
            {lang === "fr"
              ? "Dis-nous tes dates et la voiture visée, on te répond avec une vraie disponibilité. En horaires bureau, réponse rapide."
              : "Tell us your dates and the car you want, we'll reply with real availability. Fast reply during office hours."}
          </p>
          <div className="mt-6 space-y-2.5">
            <a href={waDirect} target="_blank" rel="noopener" className="group flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-success px-6 text-[15px] font-bold text-white transition hover:brightness-110 active:scale-[0.98]">
              <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
              WhatsApp direct
            </a>
            <a href="tel:+212661689659" className="flex min-h-[56px] w-full items-center justify-center rounded-full bg-white/10 px-6 text-[15px] font-bold text-white transition hover:bg-white/15 active:scale-[0.98]">
              +212 6 61 68 96 59
            </a>
          </div>
          <p className="mt-4 rounded-2xl bg-white/[0.06] px-4 py-3 text-[12px] leading-5 text-white/55">
            {lang === "fr"
              ? "Astuce : précise tes dates aller/retour et ton lieu (aéroport, hôtel) pour une réponse en un seul message."
              : "Tip: include your pick-up/return dates and place (airport, hotel) for a one-message answer."}
          </p>
        </div>
        </Reveal>
      </section>
    </>
  );
}
