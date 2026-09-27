"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, Star, ShieldCheck, Timer } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

const EASE = [0.05, 0.7, 0.1, 1] as const;

export default function Hero() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  const anim = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: [...EASE] as unknown as [number, number, number, number] } };

  return (
    <section className="bg-background px-3 pt-24 sm:px-5 sm:pt-28" aria-label="Présentation">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[32px] bg-ink text-white shadow-m3-3">
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <div>
              <motion.div {...anim(0)}>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-bold tracking-wide text-white/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary-container" />
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
                <Link href="/voitures" className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-primary px-7 text-[15px] font-bold text-white shadow-m3-2 transition hover:brightness-110 active:scale-[0.98]">
                  {t("hero_cta_vehicles")} <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/contact" className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-white/10 px-7 text-[15px] font-bold text-white transition hover:bg-white/15 active:scale-[0.98]">
                  {t("hero_cta_contact")}
                </Link>
              </motion.div>
              <motion.div {...anim(0.32)} className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5 rounded-full bg-white/10 px-2.5 py-1 font-bold text-white">
                    <Star className="h-3.5 w-3.5 fill-tertiary-container text-tertiary-container" /> 4.9
                  </span>
                  120+ avis vérifiés
                </span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-tertiary-container" /> {t("hero_location")}</span>
              </motion.div>
            </div>

            <motion.div
              {...anim(0.2)}
              className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-surface-container-lowest to-primary-container p-6 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-bold text-white">Dacia Duster • SUV</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold shadow-m3-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" /> 4.9
                </span>
              </div>
              <div className="relative mx-auto mt-2 aspect-[16/10] w-full max-w-[480px]">
                <Image src="/cars/duster.png" alt="Dacia Duster — Shamy Drive Agadir" fill sizes="(max-width: 1024px) 90vw, 480px" className="object-contain drop-shadow-2xl" priority />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="rounded-2xl bg-ink px-4 py-2.5 text-white">
                  <span className="text-[20px] font-bold">400 DH</span>
                  <span className="ml-1 text-[13px] text-white/60">/ jour</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-on-primary-container">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Assuré</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5"><Timer className="h-3.5 w-3.5" /> 30 min</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-white/[0.04]">
            {[
              ["Sans prépaiement", "Payez à la livraison"],
              ["Km illimité", "Agadir → Marrakech"],
              ["Assistance 24/7", "WhatsApp direct"],
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
