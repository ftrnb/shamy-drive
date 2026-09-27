"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { MField, fieldInput, fieldSelect } from "@/components/ui/Field";
import Reveal from "@/components/ui/Reveal";
import { calculateDays } from "@/lib/utils";

const LOCATIONS = ["Agadir Aéroport Al Massira", "Agadir Centre Ville", "Taghazout", "Tamraght", "Essaouira", "Marrakech"];

export default function SearchBar() {
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [nlQuery, setNlQuery] = useState("");
  const [errors, setErrors] = useState<{ pickup?: string; ret?: string }>({});
  const [notice, setNotice] = useState<string | null>(null);
  const router = useRouter();
  const { t, lang } = useLanguage();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const summary = useMemo(() => {
    if (!pickupDate || !returnDate) return null;
    const days = calculateDays(`${pickupDate}T00:00:00`, `${returnDate}T00:00:00`);
    if (days <= 0) return null;
    return days;
  }, [pickupDate, returnDate]);

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const errs: typeof errors = {};
    if (!pickupDate) errs.pickup = lang === "fr" ? "Choisis une date de départ" : "Pick a start date";
    if (!returnDate) errs.ret = lang === "fr" ? "Choisis une date de retour" : "Pick a return date";
    if (pickupDate && returnDate && new Date(returnDate) <= new Date(pickupDate)) {
      errs.ret = lang === "fr" ? "Le retour doit être après le départ" : "Return must be after pick-up";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setNotice(null);
    const params = new URLSearchParams({ startDate: pickupDate, endDate: returnDate });
    if (nlQuery.trim()) params.set("nl", nlQuery.trim());
    router.push(`/voitures?${params.toString()}`);
  }

  return (
    <section className="relative z-20 px-3 sm:px-5" aria-label="Recherche">
      <Reveal y={28}>
      <form
        onSubmit={handleSearch}
        className="mx-auto -mt-2 max-w-6xl rounded-[28px] border border-outline-variant/50 bg-surface-container-lowest p-4 shadow-m3-3 transition-shadow duration-300 focus-within:shadow-m3-4 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-[13px] font-bold text-primary">
            <SlidersHorizontal className="h-4 w-4" /> {t("search_badge")}
          </p>
          {summary ? (
            <p aria-live="polite" className="rounded-full bg-secondary-container px-3.5 py-1.5 text-[13px] font-bold text-on-secondary-container">
              {summary} jour{summary > 1 ? "s" : ""} • voitures vraiment disponibles
            </p>
          ) : (
            <p className="text-[12px] text-outline">Prix nets en DH • Assurance incluse</p>
          )}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-[220px_1fr_1fr_1fr_auto]">
          <MField label={t("search_location")} icon={<MapPin className="h-4 w-4" />}>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={fieldSelect} aria-label={t("search_location")}>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </MField>

          <MField label={t("search_need") as string} hint={undefined}>
            <input
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder={t("search_need_placeholder")}
              className={fieldInput}
              enterKeyHint="search"
            />
          </MField>

          <MField label={t("search_depart")} icon={<CalendarDays className="h-4 w-4" />} error={errors.pickup}>
            <input type="date" value={pickupDate} min={today} onChange={(e) => { setPickupDate(e.target.value); if (returnDate && e.target.value >= returnDate) setReturnDate(""); setErrors({}); }} className={fieldInput} />
          </MField>

          <MField label={t("search_return")} icon={<CalendarDays className="h-4 w-4" />} error={errors.ret}>
            <input type="date" value={returnDate} min={pickupDate || today} onChange={(e) => { setReturnDate(e.target.value); setErrors({}); }} className={fieldInput} />
          </MField>

          <div className="flex items-end">
            <button type="submit" className="flex h-[56px] min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-[14px] font-bold text-white shadow-m3-1 transition hover:bg-primary active:scale-[0.98] lg:w-auto">
              <Search className="h-5 w-5" /> {t("search_btn")}
            </button>
          </div>
        </div>

        {notice && <p role="status" className="mt-3 rounded-2xl bg-tertiary-container/50 px-4 py-2.5 text-[13px] font-medium">{notice}</p>}
        <p className="mt-3 text-[12px] leading-5 text-outline">{t("search_hint")}</p>
      </form>
      </Reveal>
    </section>
  );
}
