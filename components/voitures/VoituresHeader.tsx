"use client";

import { useLanguage } from "@/lib/language-context";

export default function VoituresHeader() {
  const { t } = useLanguage();
  return (
    <div className="bg-[#0A0A0A] px-6 pb-10 pt-28 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#C1272D]">Shamy Drive • Agadir</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">{t("vehicles_title")}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">{t("vehicles_subtitle")}</p>
      </div>
    </div>
  );
}
