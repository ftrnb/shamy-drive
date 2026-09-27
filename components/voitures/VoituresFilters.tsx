"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { Search, RotateCcw } from "lucide-react";
import { fieldInput } from "@/components/ui/Field";
import { easeOut } from "@/components/ui/Motion";

export default function VoituresFilters({ q, category, transmission, fuel, maxPrice }: { q?: string; category?: string; transmission?: string; fuel?: string; maxPrice?: string }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const hasActive = Boolean(q || category || transmission || fuel || maxPrice);
  return (
    <motion.form
      method="get"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
      className="mb-5 rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-m3-1 transition-shadow duration-300 focus-within:shadow-m3-2 sm:p-5"
    >
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
          <input name="q" defaultValue={q} placeholder={t("vehicles_filter_q")} className={`${fieldInput} pl-11`} aria-label={t("vehicles_filter_q")} />
        </label>
        <select name="category" defaultValue={category || ""} className={fieldInput} aria-label={t("vehicles_filter_category")}>
          <option value="">{t("vehicles_filter_category")}</option>
          <option value="Citadine">Citadine</option>
          <option value="Berline">Berline</option>
          <option value="SUV">SUV</option>
          <option value="Compacte">Compacte</option>
        </select>
        <select name="transmission" defaultValue={transmission || ""} className={fieldInput} aria-label={t("vehicles_filter_transmission")}>
          <option value="">{t("vehicles_filter_transmission")}</option>
          <option value="MANUAL">{t("vehicles_manual")}</option>
          <option value="AUTOMATIC">{t("vehicles_automatic")}</option>
        </select>
        <select name="fuel" defaultValue={fuel || ""} className={fieldInput} aria-label={t("vehicles_filter_fuel")}>
          <option value="">{t("vehicles_filter_fuel")}</option>
          <option value="ESSENCE">{t("vehicles_essence")}</option>
          <option value="DIESEL">{t("vehicles_diesel")}</option>
          <option value="HYBRIDE">{t("vehicles_hybride")}</option>
        </select>
        <input name="maxPrice" defaultValue={maxPrice} placeholder={t("vehicles_filter_budget")} type="number" min={0} inputMode="numeric" className={fieldInput} aria-label={t("vehicles_filter_budget")} />
        <div className="flex gap-2">
          <button type="submit" className="group flex h-[56px] min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[14px] font-bold text-white transition hover:bg-primary active:scale-[0.98] lg:flex-none">
            <Search className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" /> {t("vehicles_filter_btn")}
          </button>
          {hasActive && (
            <a href="/voitures" aria-label="Réinitialiser" className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition hover:bg-surface-container">
              <RotateCcw className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </motion.form>
  );
}

export function VoituresEmpty() {
  const { t } = useLanguage();
  return (
    <div className="rounded-[28px] border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
      <p className="font-display text-[20px] font-bold">{t("fleet_empty")}</p>
      <p className="mx-auto mt-2 max-w-sm text-[14px] text-on-surface-variant">{t("fleet_empty_hint")}</p>
      <a href="/voitures" className="mt-5 inline-flex min-h-[52px] items-center rounded-full bg-ink px-6 text-[14px] font-bold text-white">Voir tout</a>
    </div>
  );
}

export function VoituresAvailable({ startDate, endDate, count }: { startDate?: string; endDate?: string; count: number }) {
  const { t } = useLanguage();
  if (!startDate || !endDate) return null;
  return (
    <p className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full bg-success-container px-4 py-2 text-[13px] font-semibold text-on-success-container">
      <span className="h-2 w-2 rounded-full bg-success" />
      {t("vehicles_available")} <strong>{startDate}</strong> {t("vehicles_to")} <strong>{endDate}</strong> — {count} {t("vehicles_found")}
    </p>
  );
}
