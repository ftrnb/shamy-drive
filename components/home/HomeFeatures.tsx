"use client";

import { CheckCircle2, MapPin, Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import ShamyChat from "@/components/ai/ShamyChat";

export default function HomeFeatures() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  return (
    <>
      <section className="bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3">
          <div className="border border-zinc-200 bg-white p-7">
            <CheckCircle2 className="h-7 w-7 text-[#C1272D]" />
            <h3 className="mt-4 text-lg font-black uppercase">{isFr ? "Paiement à la livraison" : "Pay on delivery"}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{isFr ? "Pas de prépaiement bloquant. Vous réglez quand la voiture arrive, après vérification." : "No prepayment. Pay when the car arrives after inspection."}</p>
          </div>
          <div className="border border-zinc-200 bg-white p-7">
            <Shield className="h-7 w-7 text-[#C1272D]" />
            <h3 className="mt-4 text-lg font-black uppercase">{isFr ? "Kilométrage illimité" : "Unlimited mileage"}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{isFr ? "Roulez sans compter — Taghazout, Essaouira, Marrakech inclus." : "Drive without limits — Taghazout, Essaouira, Marrakech included."}</p>
          </div>
          <div className="border border-zinc-200 bg-white p-7">
            <MapPin className="h-7 w-7 text-[#C1272D]" />
            <h3 className="mt-4 text-lg font-black uppercase">{isFr ? "Livraison Agadir" : "Delivery Agadir"}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{isFr ? "Aéroport, hôtel ou domicile. Taghazout, Tamraght, Marrakech sur devis." : "Airport, hotel or home. Taghazout, Tamraght, Marrakech on request."}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-[#C1272D]">Shamy IA</p>
          <h2 className="mt-3 text-center text-3xl font-black uppercase text-white sm:text-4xl">{isFr ? "Parlez à Shamy" : "Talk to Shamy"}</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-zinc-400">{isFr ? "Décrivez votre besoin en phrase naturelle — il interroge notre vraie base de disponibilité avant de recommander." : "Describe your need in natural language — it checks real availability before recommending."}</p>
          <div className="mt-8">
            <ShamyChat />
          </div>
        </div>
      </section>
      <ShamyChat floating />
    </>
  );
}
