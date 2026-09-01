"use client";

import * as React from "react";
import Link from "next/link";
import { Users, Gauge, Fuel, Settings2, ArrowRight, Star } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

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
  const [imgError, setImgError] = React.useState(false);
  const imgSrc = imgError || !image ? "/shamydrive.png" : image;
  return (
    <article className="group overflow-hidden border border-zinc-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-[#C1272D]/30 hover:shadow-xl">
      <Link href={`/voitures/${id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 p-6 flex items-center justify-center">
          <img
            src={imgSrc}
            alt={`${brand} ${model}`}
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="bg-[#C1272D] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white">{category}</span>
            {!available && <span className="bg-[#0A0A0A] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white">Indisponible</span>}
          </div>
          <div className="absolute bottom-3 right-3 bg-[#0A0A0A] px-4 py-2 text-white">
            <span className="text-base font-black">{pricePerDay}</span>
            <span className="ml-1 text-xs text-zinc-300">DH/j</span>
          </div>
          {avgRating !== null && avgRating !== undefined && (
            <div className="absolute right-3 top-3 flex items-center gap-1 bg-white px-2 py-1 text-[11px] font-bold shadow">
              <Star className="h-3 w-3 fill-[#C1272D] text-[#C1272D]" /> {avgRating.toFixed(1)}
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C1272D]">{brand}</p>
        <h3 className="mt-1 text-xl font-black uppercase tracking-tight text-[#0A0A0A]">{model}</h3>

        <div className="mt-4 grid grid-cols-2 gap-3 border-y border-zinc-100 py-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-[#C1272D]" />
            <div>
              <p className="text-[9px] uppercase tracking-wider text-zinc-400">{t("common_transmission")}</p>
              <p className="text-xs font-bold text-zinc-800">{transmission === "AUTOMATIC" ? t("vehicles_automatic") : transmission === "MANUAL" ? t("vehicles_manual") : transmission}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-[#C1272D]" />
            <div>
              <p className="text-[9px] uppercase tracking-wider text-zinc-400">{t("common_fuel")}</p>
              <p className="text-xs font-bold text-zinc-800">{fuel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#C1272D]" />
            <div>
              <p className="text-[9px] uppercase tracking-wider text-zinc-400">{t("common_seats")}</p>
              <p className="text-xs font-bold text-zinc-800">{seats}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-[#C1272D]" />
            <div>
              <p className="text-[9px] uppercase tracking-wider text-zinc-400">{t("common_available")}</p>
              <p className={`text-xs font-bold ${available ? "text-green-600" : "text-zinc-400"}`}>{available ? t("common_now") : t("common_on_request")}</p>
            </div>
          </div>
        </div>

        <Link href={`/voitures/${id}`} className="mt-4 flex w-full items-center justify-between bg-[#0A0A0A] px-5 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#C1272D]">
          <span>{t("common_view_vehicle")}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
