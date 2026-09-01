"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function ReservationHeader({ car, id }: { car: any; id: string }) {
  const { lang } = useLanguage();
  return (
    <div className="bg-[#0A0A0A] px-6 pb-8 pt-24">
      <div className="mx-auto max-w-7xl">
        <Link href={`/voitures/${id}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Retour au véhicule" : "Back to car"}
        </Link>
        <h1 className="mt-4 text-3xl font-black uppercase text-white sm:text-4xl">
          {lang === "fr" ? `Réserver ${car.brand} ${car.model}` : `Book ${car.brand} ${car.model}`}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {car.pricePerDay} {lang === "fr" ? "DH / jour • Réservation réelle avec vérification disponibilité" : "MAD / day • Real booking with availability check"}
        </p>
      </div>
    </div>
  );
}
