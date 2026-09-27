"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Users, Infinity as InfinityIcon, Car } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { FadeImage, easeOut } from "@/components/ui/Motion";

export default function Hero() {
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const cardY = useTransform(scrollY, [0, 700], [0, 70]);
  const textY = useTransform(scrollY, [0, 700], [0, -36]);

  const anim = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.65, delay, ease: easeOut },
        };

  return (
    <section className="bg-background px-3 pt-24 sm:px-5 sm:pt-28" aria-label="Présentation">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[32px] bg-ink text-white shadow-m3-3">
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <motion.div style={reduce ? undefined : { y: textY }}>
              <motion.div {...anim(0)}>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-bold tracking-wide text-white/85">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-tertiary-container" />
                  {t("hero_badge")}
                </p>
              </motion.div>
              <motion.h1 {...anim(0.08)} className="mt-5 font-display text-[44px] font-bold leading-[0.98] tracking-tight sm:text-[64px] lg:text-[72px]">
                {t("hero_title1")}
                <br />
                <span className="text-tertiary-container">{t("hero_title2")}</span>
              </motion.h1>
              <motion.p {...anim(0.16)} className="mt-5 max-w-md text-[15px] leading-7 text-white/70">
                {t("hero_desc")}
              </motion.p>
              <motion.div {...anim(0.24)} className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <Link href="/voitures" className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-primary px-7 text-[15px] font-bold text-white shadow-m3-2 transition hover:brightness-110 active:scale-[0.98]">
                  {t("hero_cta_vehicles")} <ArrowRight className="arrow-nudge h-5 w-5" />
                </Link>
                <Link href="/contact" className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-white/10 px-7 text-[15px] font-bold text-white transition hover:bg-white/15 active:scale-[0.98]">
                  {t("hero_cta_contact")}
                </Link>
              </motion.div>
              <motion.div {...anim(0.32)} className="mt-7 flex flex-wrap items-center gap-2 text-[13px]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 font-bold text-white">
                  {lang === "fr" ? "Dès 250 DH/j" : "From 250 MAD/d"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 font-semibold text-white/80">
                  <Car className="h-4 w-4 text-tertiary-container" />
                  {lang === "fr" ? "Citadines • Berlines • SUV" : "City • Sedan • SUV"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-1 text-white/60">
                  <MapPin className="h-4 w-4 text-tertiary-container" /> {t("hero_location")}
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              {...anim(0.2)}
              style={reduce ? undefined : { y: cardY }}
              className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-surface-container-lowest to-primary-container p-6 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-bold text-white">Dacia Duster • SUV</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-ink shadow-m3-1">
                  <Users className="h-3.5 w-3.5" /> 5 places
                </span>
              </div>
              <div className="relative mx-auto mt-2 aspect-[16/10] w-full max-w-[480px]">
                <FadeImage src="/cars/duster.png" alt="Dacia Duster — Shamy Drive Agadir" sizes="(max-width: 1024px) 90vw, 480px" eager className="object-contain drop-shadow-2xl" />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="animate-float rounded-2xl bg-ink px-4 py-2.5 text-white">
                  <span className="text-[20px] font-bold">350 DH</span>
                  <span className="ml-1 text-[13px] text-white/60">/ jour</span>
                </div>
                <div className="animate-float-late inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-bold text-ink">
                  <InfinityIcon className="h-4 w-4" /> Km illimité
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-white/[0.04]">
            {[
              [lang === "fr" ? "Sans prépaiement" : "No prepayment", lang === "fr" ? "Payez à la livraison" : "Pay on delivery"],
              [lang === "fr" ? "Km illimité" : "Unlimited mileage", lang === "fr" ? "Inclus d'office" : "Always included"],
              ["WhatsApp direct", lang === "fr" ? "Réponse rapide" : "Fast reply"],
            ].map(([a, b]) => (
              <div key={a} className="px-4 py-4 text-center sm:py-5">
                <p className="text-[13px] font-bold text-white sm:text-[14px]">{a}</p>
                <p className="mt-0.5 text-[12px] text-white/55">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
