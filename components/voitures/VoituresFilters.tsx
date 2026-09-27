"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { Search, RotateCcw, X, SearchX } from "lucide-react";
import { fieldInput } from "@/components/ui/Field";
import { easeOut } from "@/components/ui/Motion";

type FilterProps = {
  q?: string;
  category?: string;
  transmission?: string;
  fuel?: string;
  maxPrice?: string;
  nl?: string;
  startDate?: string;
  endDate?: string;
};

function chipHref(all: FilterProps, remove: keyof FilterProps): string {
  const p = new URLSearchParams();
  (Object.keys(all) as (keyof FilterProps)[]).forEach((k) => {
    if (k !== remove && all[k]) p.set(k, all[k] as string);
  });
  const s = p.toString();
  return s ? `/voitures?${s}` : "/voitures";
}

export function ActiveChips(props: FilterProps) {
  const { lang } = useLanguage();
  const chips: { key: keyof FilterProps; label: string }[] = [];
  if (props.q) chips.push({ key: "q", label: `“${props.q}”` });
  if (props.category) chips.push({ key: "category", label: props.category });
  if (props.transmission) chips.push({ key: "transmission", label: props.transmission === "AUTOMATIC" ? "Auto" : "Manuelle" });
  if (props.fuel) chips.push({ key: "fuel", label: props.fuel });
  if (props.maxPrice) chips.push({ key: "maxPrice", label: `≤ ${props.maxPrice} DH` });
  if (props.nl) chips.push({ key: "nl", label: `“${props.nl.length > 24 ? `${props.nl.slice(0, 24)}…` : props.nl}”` });
  if (chips.length === 0) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5" aria-label={lang === "fr" ? "Filtres actifs" : "Active filters"}>
      <AnimatePresence initial={false}>
        {chips.map((c) => (
          <motion.a
            key={c.key}
            href={chipHref(props, c.key)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="group inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-ink py-1.5 pl-4 pr-2.5 text-[12px] font-bold text-white transition hover:bg-primary active:scale-95"
            aria-label={`${lang === "fr" ? "Retirer" : "Remove"} ${c.label}`}
          >
            {c.label}
            <X className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
          </motion.a>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function VoituresFilters({ q, category, transmission, fuel, maxPrice, nl, startDate, endDate }: FilterProps) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const hasActive = Boolean(q || category || transmission || fuel || maxPrice || nl);
  return (
    <motion.form
      method="get"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
      className="mb-5 rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-m3-1 transition-shadow duration-300 focus-within:shadow-m3-2 sm:p-5"
    >
      {/* Preserve date + NL context across filter submits */}
      {startDate ? <input type="hidden" name="startDate" value={startDate} /> : null}
      {endDate ? <input type="hidden" name="endDate" value={endDate} /> : null}
      {nl ? <input type="hidden" name="nl" value={nl} /> : null}
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
            <a href={startDate && endDate ? `/voitures?startDate=${startDate}&endDate=${endDate}` : "/voitures"} aria-label="Réinitialiser" title="Réinitialiser" className="group flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition hover:bg-surface-container active:scale-95">
              <RotateCcw className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-180" />
            </a>
          )}
        </div>
      </div>
    </motion.form>
  );
}

export function VoituresEmpty() {
  const { t, lang } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="rounded-[28px] border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
        <SearchX className="h-7 w-7 text-primary" />
      </span>
      <p className="mt-4 font-display text-[20px] font-bold">{t("fleet_empty")}</p>
      <p className="mx-auto mt-2 max-w-sm text-[14px] text-on-surface-variant">{t("fleet_empty_hint")}</p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <a href="/voitures" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-7 text-[14px] font-bold text-white transition hover:bg-primary active:scale-[0.98]">
          {lang === "fr" ? "Voir tout" : "View all"}
        </a>
        <a href="https://wa.me/212661689659" target="_blank" rel="noopener" className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-outline-variant px-7 text-[14px] font-bold transition hover:bg-surface-container active:scale-[0.98]">
          WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

export function VoituresAvailable({ startDate, endDate, count }: { startDate?: string; endDate?: string; count: number }) {
  const { t } = useLanguage();
  if (!startDate || !endDate) return null;
  return (
    <motion.p
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full bg-success-container px-4 py-2 text-[13px] font-semibold text-on-success-container"
    >
      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-success" />
      {t("vehicles_available")} <strong>{startDate}</strong> {t("vehicles_to")} <strong>{endDate}</strong> — {count} {t("vehicles_found")}
    </motion.p>
  );
}
