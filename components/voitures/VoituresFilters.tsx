"use client";

import { useLanguage } from "@/lib/language-context";

export default function VoituresFilters({ q, category, transmission, fuel, maxPrice }: { q?: string; category?: string; transmission?: string; fuel?: string; maxPrice?: string }) {
  const { t } = useLanguage();
  return (
    <form method="get" className="mb-8 grid gap-3 border border-zinc-200 bg-white p-4 sm:grid-cols-3 lg:grid-cols-6">
      <input name="q" defaultValue={q} placeholder={t("vehicles_filter_q")} className="border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-[#C1272D]" />
      <select name="category" defaultValue={category || ""} className="border border-zinc-200 px-3 py-3 text-sm">
        <option value="">{t("vehicles_filter_category")}</option>
        <option value="Citadine">Citadine</option>
        <option value="Berline">Berline</option>
        <option value="SUV">SUV</option>
        <option value="Compacte">Compacte</option>
      </select>
      <select name="transmission" defaultValue={transmission || ""} className="border border-zinc-200 px-3 py-3 text-sm">
        <option value="">{t("vehicles_filter_transmission")}</option>
        <option value="MANUAL">{t("vehicles_manual")}</option>
        <option value="AUTOMATIC">{t("vehicles_automatic")}</option>
      </select>
      <select name="fuel" defaultValue={fuel || ""} className="border border-zinc-200 px-3 py-3 text-sm">
        <option value="">{t("vehicles_filter_fuel")}</option>
        <option value="ESSENCE">{t("vehicles_essence")}</option>
        <option value="DIESEL">{t("vehicles_diesel")}</option>
        <option value="HYBRIDE">{t("vehicles_hybride")}</option>
      </select>
      <input name="maxPrice" defaultValue={maxPrice} placeholder={t("vehicles_filter_budget")} type="number" className="border border-zinc-200 px-3 py-3 text-sm" />
      <button type="submit" className="bg-[#0A0A0A] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#C1272D] transition">{t("vehicles_filter_btn")}</button>
    </form>
  );
}

export function VoituresEmpty() {
  const { t } = useLanguage();
  return (
    <div className="border border-zinc-200 bg-white p-10 text-center">
      <p className="text-lg font-black uppercase">{t("fleet_empty")}</p>
      <p className="mt-2 text-sm text-zinc-500">{t("fleet_empty_hint")}</p>
    </div>
  );
}

export function VoituresAvailable({ startDate, endDate, count }: { startDate?: string; endDate?: string; count: number }) {
  const { t } = useLanguage();
  if (!startDate || !endDate) return null;
  return <p className="mb-4 text-sm text-zinc-500">{t("vehicles_available")} <strong className="text-black">{startDate}</strong> {t("vehicles_to")} <strong className="text-black">{endDate}</strong> — {count} {t("vehicles_found")}</p>;
}
