"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, MapPin, CalendarCheck, MessageCircle, ChevronDown, Car, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { SectionHeader } from "@/components/ui/M3";
import Reveal from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Motion";

/** Real catalogue facts (prisma/seed.ts): 10 cars, 250–400 DH/j, all 5 seats. */
const FLEET_ROWS = [
  { label: "Citadines", detail: "Sandero • 208 • Clio 5", price: "dès 250 DH/j" },
  { label: "Berlines", detail: "Logan • Accent auto", price: "dès 250 DH/j" },
  { label: "SUV", detail: "Duster • Sonet auto • Jolion auto", price: "dès 350 DH/j" },
];

export default function HomeFeatures() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [aiOpen, setAiOpen] = useState(false);

  const trust = [
    { icon: BadgeCheck, title: isFr ? "Paiement à la livraison" : "Pay on delivery", desc: isFr ? "Pas de prépaiement bloqué. Tu règles à la remise des clés, après état des lieux." : "No prepayment. Pay when you get the keys, after inspection." },
    { icon: ShieldCheck, title: isFr ? "Km illimité inclus" : "Unlimited mileage", desc: isFr ? "Inclus d'office sur chaque voiture du catalogue, assurance de base comprise." : "Included on every car in the catalog, base insurance covered." },
    { icon: MapPin, title: isFr ? "Livraison Agadir" : "Agadir delivery", desc: isFr ? "Aéroport Al Massira, hôtel ou domicile. Taghazout et Tamraght aussi." : "Al Massira airport, hotel or home. Taghazout too." },
  ];

  const steps = [
    { icon: CalendarCheck, n: "1", title: isFr ? "Choisis tes dates" : "Pick your dates", desc: isFr ? "Seules les voitures vraiment disponibles s'affichent." : "Only truly available cars show up." },
    { icon: BadgeCheck, n: "2", title: isFr ? "Envoie tes infos" : "Send your details", desc: isFr ? "Pièce d'identité + téléphone. L'équipe confirme chaque demande." : "ID + phone. The team confirms every request." },
    { icon: MapPin, n: "3", title: isFr ? "On te livre" : "We deliver", desc: isFr ? "État des lieux, clés, et c'est parti. Paiement sur place." : "Inspection, keys, go. Pay on site." },
  ];

  return (
    <>
      <section className="mx-auto max-w-6xl px-3 sm:px-5" aria-label="Garanties">
        <Stagger className="grid gap-3 md:grid-cols-3">
          {trust.map((c) => (
            <StaggerItem key={c.title}>
              <div className="m3-card-hover h-full rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1 hover:shadow-m3-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container transition-transform duration-300 hover:scale-110 hover:rotate-3"><c.icon className="h-6 w-6 text-on-primary-container" /></span>
                <h3 className="mt-4 font-display text-[18px] font-bold">{c.title}</h3>
                <p className="mt-1.5 text-[14px] leading-6 text-on-surface-variant">{c.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-10 sm:px-5" aria-label="Comment ça marche">
        <Reveal>
          <div className="rounded-[32px] bg-surface-container p-7 transition-colors duration-300 sm:p-10">
            <SectionHeader eyebrow={isFr ? "Simple comme WhatsApp" : "Simple as WhatsApp"} title={isFr ? "Réserver en 3 gestes" : "Book in 3 steps"} desc={isFr ? "Pas de compte requis pour commencer. Tout se fait depuis ton téléphone." : "No account needed to start. All from your phone."} />
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="group rounded-[24px] bg-surface-container-lowest p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-m3-2">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white transition-transform duration-300 group-hover:scale-110">{s.n}</span>
                    <s.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-125" />
                  </div>
                  <h3 className="mt-4 font-display text-[17px] font-bold">{s.title}</h3>
                  <p className="mt-1 text-[13px] leading-6 text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/voitures" className="group inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-bold text-white shadow-m3-1 transition hover:brightness-110 active:scale-[0.98]">
                {isFr ? "Choisir ma voiture" : "Pick my car"} <ArrowRight className="arrow-nudge h-5 w-5" />
              </Link>
              <a href="https://wa.me/212661689659" target="_blank" rel="noopener" className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-6 text-[15px] font-bold transition hover:bg-surface-container-low active:scale-[0.98]">
                <MessageCircle className="h-5 w-5 text-success transition-transform duration-300 hover:scale-125 hover:-rotate-12" /> WhatsApp direct
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-5" aria-label="Catalogue et assistant">
        <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="flex h-full flex-col rounded-[32px] bg-ink p-7 text-white sm:p-8">
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold text-white/85">
                <Car className="h-4 w-4 text-tertiary-container" />
                {isFr ? "Le catalogue, en clair" : "The lineup, plainly"}
              </p>
              <div className="mt-5 flex-1 space-y-2.5">
                {FLEET_ROWS.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.06] px-4 py-3.5 transition-colors duration-200 hover:bg-white/10">
                    <div>
                      <p className="text-[14px] font-bold">{r.label}</p>
                      <p className="mt-0.5 text-[12px] text-white/55">{r.detail}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-tertiary-container px-3.5 py-1.5 text-[12px] font-bold text-on-tertiary-container">{r.price}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[12px] leading-5 text-white/50">{isFr ? "Prix nets affichés par voiture, kilométrage illimité inclus." : "Net prices shown per car, unlimited mileage included."}</p>
              <Link href="/voitures" className="group mt-5 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-bold text-ink transition hover:bg-tertiary-container hover:text-on-tertiary-container active:scale-[0.98]">
                {isFr ? "Voir le catalogue" : "Browse the catalog"} <ArrowRight className="arrow-nudge h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest p-7 transition-colors duration-300 sm:p-8">
              <p className="text-[12px] font-bold uppercase tracking-widest text-primary">Shamy IA</p>
              <h3 className="mt-2 font-display text-[24px] font-bold">{isFr ? "Décris ton besoin, on te guide" : "Describe your need"}</h3>
              <p className="mt-2 text-[14px] leading-6 text-on-surface-variant">
                {isFr ? "Ex : « SUV auto 5 places sous 500 DH pour Taghazout ». L'assistant filtre le catalogue pour toi." : "E.g. “Auto SUV 5 seats under 500 MAD”. The assistant filters for you."}
              </p>
              <button
                onClick={() => setAiOpen(!aiOpen)}
                aria-expanded={aiOpen}
                className="mt-5 flex min-h-[56px] w-full items-center justify-between rounded-full bg-secondary-container px-6 text-[15px] font-bold text-on-secondary-container transition hover:brightness-95 active:scale-[0.99]"
              >
                {aiOpen ? (isFr ? "Masquer l'assistant" : "Hide assistant") : (isFr ? "Ouvrir l'assistant" : "Open assistant")}
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${aiOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {aiOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.05, 0.7, 0.1, 1] }} className="overflow-hidden">
                    <div className="mt-4 overflow-hidden rounded-[20px] border border-outline-variant/40 bg-white dark:bg-surface-container-low">
                      <div id="deployment-2301234b-750f-4382-bddf-70702c53a473" className="h-[min(600px,70dvh)] w-full" />
                    </div>
                    <p className="mt-2 text-[12px] text-outline">Chargé uniquement quand tu l'ouvres — plus rapide sur mobile.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
