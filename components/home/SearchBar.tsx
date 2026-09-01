"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";

export default function SearchBar() {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [nlQuery, setNlQuery] = useState("");
  const router = useRouter();
  const { t, lang } = useLanguage();

  function handleSearch() {
    if (!pickupDate || !returnDate) {
      alert(lang === "fr" ? "Choisis tes dates pour voir les voitures vraiment disponibles." : "Pick dates to see truly available cars.");
      return;
    }
    if (new Date(returnDate) <= new Date(pickupDate)) {
      alert(lang === "fr" ? "La date de retour doit être après le départ." : "Return must be after pick-up.");
      return;
    }
    const params = new URLSearchParams({ startDate: pickupDate, endDate: returnDate });
    if (nlQuery) params.set("nl", nlQuery);
    router.push(`/voitures?${params.toString()}`);
  }

  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl border border-zinc-200 bg-white p-4 shadow-2xl sm:p-6">
        <p className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#C1272D]">
          <Sparkles className="h-4 w-4" /> {t("search_badge")}
        </p>

        <div className="grid gap-4 lg:grid-cols-[180px_1fr_1fr_1fr_auto] lg:items-end">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <MapPin className="h-4 w-4 text-[#C1272D]" /> {t("search_location")}
            </label>
            <div className="flex h-[52px] items-center border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold">Agadir</div>
          </div>

          <div>
            <label htmlFor="nl" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
              {t("search_need")}
            </label>
            <input
              id="nl"
              placeholder={t("search_need_placeholder")}
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              className="h-[52px] w-full border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none focus:border-[#C1272D] focus:ring-1 focus:ring-[#C1272D]"
            />
          </div>

          <div>
            <label htmlFor="pickup" className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <CalendarDays className="h-4 w-4 text-[#C1272D]" /> {t("search_depart")}
            </label>
            <input
              id="pickup"
              type="date"
              value={pickupDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setPickupDate(e.target.value)}
              className="h-[52px] w-full border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none focus:border-[#C1272D]"
            />
          </div>

          <div>
            <label htmlFor="return" className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <CalendarDays className="h-4 w-4 text-[#C1272D]" /> {t("search_return")}
            </label>
            <input
              id="return"
              type="date"
              value={returnDate}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setReturnDate(e.target.value)}
              className="h-[52px] w-full border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none focus:border-[#C1272D]"
            />
          </div>

          <button onClick={handleSearch} className="flex h-[52px] items-center justify-center gap-2 bg-[#0A0A0A] px-7 text-sm font-black uppercase tracking-wider text-white hover:bg-[#C1272D] transition">
            <Search className="h-5 w-5" /> {t("search_btn")}
          </button>
        </div>

        <p className="mt-3 text-xs text-zinc-400">{t("search_hint")}</p>
      </div>
    </section>
  );
}
