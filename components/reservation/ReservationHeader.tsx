"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function ReservationHeader({ car, id }: { car: any; id: string }) {
  const { lang } = useLanguage();
  return (
    <div className="px-3 pt-24 sm:px-5 sm:pt-28">
      <div className="mx-auto max-w-6xl rounded-[32px] bg-ink p-7 text-white sm:p-8">
        <Link href={`/voitures/${id}`} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white/10 px-4 text-[13px] font-bold text-white/80 transition hover:bg-white/15 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Retour au véhicule" : "Back to car"}
        </Link>
        <h1 className="mt-4 font-display text-[28px] font-bold leading-tight sm:text-[36px]">
          {lang === "fr" ? `Réserver ${car.brand} ${car.model}` : `Book ${car.brand} ${car.model}`}
        </h1>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-[13px] font-bold">
          {car.pricePerDay} {lang === "fr" ? "DH / jour • Dispo vérifiée" : "MAD / day • Checked"}
        </p>
      </div>
    </div>
  );
}
