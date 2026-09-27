"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Eyebrow } from "@/components/ui/M3";

export default function FleetHeader() {
  const { t } = useLanguage();
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow>{t("fleet_badge")}</Eyebrow>
        <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.02] tracking-tight sm:text-[44px]">
          {t("fleet_title")} {t("fleet_title2")}
        </h2>
      </div>
      <div className="max-w-md">
        <p className="text-[14px] leading-7 text-on-surface-variant">{t("fleet_desc")}</p>
        <Link href="/voitures" className="mt-3 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-bold text-white transition hover:bg-primary active:scale-[0.98]">
          {t("fleet_view_all")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
