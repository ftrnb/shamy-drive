"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function FleetHeader() {
  const { t } = useLanguage();
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-sm font-black uppercase tracking-[0.22em] text-[#C1272D]">{t("fleet_badge")}</p>
        <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">{t("fleet_title")}<br />{t("fleet_title2")}</h2>
      </div>
      <div>
        <p className="max-w-md text-sm leading-7 text-zinc-500">{t("fleet_desc")}</p>
        <Link href="/voitures" className="mt-3 inline-block text-sm font-bold text-[#C1272D] hover:text-black transition">{t("fleet_view_all")}</Link>
      </div>
    </div>
  );
}
