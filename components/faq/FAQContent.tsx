"use client";

import { useLanguage } from "@/lib/language-context";

const faqsFr = [
  { q: "Faut-il payer à l'avance ?", a: "Non. Tu réserves, on vérifie la dispo et on te confirme. Paiement à la livraison, après état des lieux." },
  { q: "Kilométrage ?", a: "Kilométrage illimité sur toutes nos formules à Agadir. Tu roules sans compter — Taghazout, Marrakech, désert, c'est inclus." },
  { q: "Livraison hors Agadir ?", a: "Oui : Taghazout, Tamraght, Essaouira, Marrakech sur devis. Dis-nous où et quand." },
  { q: "Que faire en cas de panne ?", a: "Appelle le numéro sur le contrat — assistance 24/7. Véhicule de remplacement selon dispo." },
];

const faqsEn = [
  { q: "Do I need to pay in advance?", a: "No. You book, we check availability and confirm. Pay on delivery after inspection." },
  { q: "Mileage?", a: "Unlimited mileage on all Agadir packages. Drive without limits — Taghazout, Marrakech, desert included." },
  { q: "Delivery outside Agadir?", a: "Yes: Taghazout, Tamraght, Essaouira, Marrakech on request. Tell us where and when." },
  { q: "What if the car breaks down?", a: "Call the number on the contract — 24/7 assistance. Replacement vehicle subject to availability." },
];

export default function FAQContent() {
  const { lang } = useLanguage();
  const faqs = lang === "fr" ? faqsFr : faqsEn;
  const isFr = lang === "fr";
  return (
    <>
      <div className="bg-[#0A0A0A] px-6 pb-12 pt-28 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#C1272D]">FAQ</p>
          <h1 className="mt-3 text-4xl font-black uppercase">{isFr ? "Questions fréquentes." : "Frequent questions."}</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-300">{isFr ? "Tout ce que nos clients demandent avant de réserver. Si tu ne trouves pas ta réponse, Shamy ou WhatsApp te répondent en direct." : "Everything clients ask before booking. If you don't find an answer, Shamy or WhatsApp will reply live."}</p>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="divide-y divide-zinc-200 border border-zinc-200">
          {faqs.map((f) => (
            <details key={f.q} className="group bg-white p-6 open:bg-zinc-50">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-black uppercase">
                {f.q}
                <span className="ml-4 text-[#C1272D] group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
