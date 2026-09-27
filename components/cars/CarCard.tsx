"use client";

import Link from "next/link";
import { Users, Fuel, Settings2, ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { FadeImage, easeOut } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

interface CarCardProps {
  id: string;
  brand: string;
  model: string;
  category: string;
  pricePerDay: number;
  image: string;
  transmission: string;
  fuel: string;
  seats: number;
  avgRating?: number | null;
  available?: boolean;
}

export default function CarCard({ id, brand, model, category, pricePerDay, image, transmission, fuel, seats, avgRating, available = true }: CarCardProps) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const imgSrc = !image ? "/cars/Loganblanche.png" : image;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: easeOut }}
      className="m3-card-hover group flex flex-col overflow-hidden rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest shadow-m3-1 transition-colors duration-300 hover:shadow-m3-3"
    >
      <Link href={`/voitures/${id}`} className="block focus:outline-none" aria-label={`${brand} ${model} — ${pricePerDay} DH par jour`}>
        <div className="img-fade relative aspect-[16/10] overflow-hidden p-5">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
            <FadeImage src={imgSrc} alt={`${brand} ${model}`} className="object-contain drop-shadow-xl" />
          </div>
          <div className="absolute left-4 top-4 flex gap-1.5">
            <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold text-white">{category}</span>
            {!available && <span className="rounded-full bg-error px-3 py-1.5 text-[11px] font-bold text-white">Indisponible</span>}
          </div>
          {avgRating != null && (
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-surface-container-lowest/95 px-2.5 py-1.5 text-[12px] font-bold shadow-m3-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {avgRating.toFixed(1)}
            </div>
          )}
          <div className="absolute bottom-4 right-4 rounded-full bg-primary px-4 py-2 text-white shadow-m3-1">
            <span className="text-[15px] font-bold">{pricePerDay} DH</span>
            <span className="ml-1 text-[12px] text-white/75">/j</span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12px] font-bold uppercase tracking-widest text-primary">{brand}</p>
        <h3 className="mt-0.5 font-display text-[20px] font-bold leading-tight">{model}</h3>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: Settings2, label: t("common_transmission"), value: transmission === "AUTOMATIC" ? t("vehicles_automatic") : transmission === "MANUAL" ? t("vehicles_manual") : transmission },
            { icon: Fuel, label: t("common_fuel"), value: fuel },
            { icon: Users, label: t("common_seats"), value: `${seats} pl` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-surface-container px-3 py-2.5 text-center">
              <s.icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 truncate text-[12px] font-bold">{s.value}</p>
              <p className="text-[11px] text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-[12px] font-semibold">
          <span className={cn("h-2 w-2 rounded-full", available ? "bg-success animate-pulse-dot" : "bg-outline")} />
          <span className={available ? "text-success" : "text-outline"}>{available ? t("common_now") : t("common_on_request")}</span>
        </div>

        <Link href={`/voitures/${id}`} className="m3-state-layer mt-4 flex min-h-[52px] w-full items-center justify-between rounded-full bg-secondary-container px-5 text-[14px] font-bold text-on-secondary-container transition active:scale-[0.98]">
          <span>{t("common_view_vehicle")}</span>
          <ArrowRight className="arrow-nudge h-5 w-5" />
        </Link>
      </div>
    </motion.article>
  );
}
