"use client";

import { useLanguage } from "@/lib/language-context";

/** Real catalogue ticker — model names + honest prices, pauses on hover. */
const ITEMS = [
  "Dacia Logan — dès 250 DH/j",
  "Dacia Sandero — dès 250 DH/j",
  "Renault Clio 5 — dès 300 DH/j",
  "Peugeot 208 — dès 300 DH/j",
  "Hyundai Accent auto — dès 300 DH/j",
  "Dacia Duster — dès 350 DH/j",
  "Kia Sonet auto — dès 400 DH/j",
  "Haval Jolion auto — dès 400 DH/j",
  "Kilométrage illimité inclus",
];

export default function Ticker() {
  const { lang } = useLanguage();
  const items = lang === "fr" ? ITEMS : ITEMS.map((s) => s.replace("dès", "from").replace("DH/j", "MAD/d").replace("Kilométrage illimité inclus", "Unlimited mileage included"));
  const row = [...items, ...items];
  return (
    <section aria-hidden className="overflow-hidden border-y border-outline-variant/40 bg-surface-container-low py-3.5">
      <div className="ticker-mask">
        <div className="ticker-track items-center gap-8 pr-8">
          {row.map((s, i) => (
            <span key={i} className="flex shrink-0 items-center gap-8 text-[13px] font-bold tracking-wide text-on-surface-variant">
              {s}
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
