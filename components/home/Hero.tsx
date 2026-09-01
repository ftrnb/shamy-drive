"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=85"
          alt="Shamy Drive Agadir"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/20" />
      </div>

      <div className="absolute left-[-10%] top-[30%] h-72 w-72 rounded-full bg-[#C1272D]/15 blur-[110px]" />

      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl items-center px-5 pb-16 pt-28 lg:px-8">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 inline-flex items-center gap-2 border border-white/15 bg-black/30 px-4 py-2 backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#C1272D]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-200">{t("hero_badge")}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[92px]">
            {t("hero_title1")}<br />
            <span className="text-[#C1272D]">{t("hero_title2")}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6 max-w-xl text-[15px] leading-7 text-zinc-300 sm:text-base">
            {t("hero_desc")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/voitures" className="inline-flex items-center justify-center gap-2 bg-[#C1272D] px-7 py-4 text-xs font-black uppercase tracking-[0.14em] hover:bg-white hover:text-black transition">
              {t("hero_cta_vehicles")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center border border-white/25 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.14em] backdrop-blur hover:bg-white hover:text-black transition">
              {t("hero_cta_contact")}
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
            <MapPin className="h-4 w-4 text-[#C1272D]" /> {t("hero_location")}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
