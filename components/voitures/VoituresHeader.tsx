"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { Eyebrow } from "@/components/ui/M3";
import { easeOut } from "@/components/ui/Motion";

export default function VoituresHeader() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  return (
    <div className="px-3 pt-24 sm:px-5 sm:pt-28">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-ink p-7 text-white shadow-m3-3 sm:p-10"
      >
        <Eyebrow className="bg-white/10 text-white">Shamy Drive • Agadir</Eyebrow>
        <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.02] tracking-tight sm:text-[48px]">{t("vehicles_title")}</h1>
        <p className="mt-3 max-w-2xl text-[14px] leading-6 text-white/65">{t("vehicles_subtitle")}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Citadine", "SUV", "Berline", "Automatique"].map((c, i) => (
            <motion.span
              key={c}
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.07, duration: 0.4, ease: easeOut }}
              className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/20"
            >
              {c}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
