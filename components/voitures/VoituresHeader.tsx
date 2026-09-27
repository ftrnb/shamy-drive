"use client";

import { useLanguage } from "@/lib/language-context";
import { Eyebrow } from "@/components/ui/M3";

export default function VoituresHeader() {
  const { t } = useLanguage();
  return (
    <div className="px-3 pt-24 sm:px-5 sm:pt-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-ink p-7 text-white sm:p-10">
        <Eyebrow className="bg-white/10 text-white">Shamy Drive • Agadir</Eyebrow>
        <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.02] tracking-tight sm:text-[48px]">{t("vehicles_title")}</h1>
        <p className="mt-3 max-w-2xl text-[14px] leading-6 text-white/65">{t("vehicles_subtitle")}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Citadine", "SUV", "Berline", "Automatique"].map((c) => (
            <span key={c} className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold text-white/85">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
