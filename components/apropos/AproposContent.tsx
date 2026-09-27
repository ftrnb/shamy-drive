"use client";

import { Shield, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Eyebrow } from "@/components/ui/M3";
import Reveal from "@/components/ui/Reveal";

export default function AproposContent() {
  const { t } = useLanguage();
  const cards = [
    { icon: Shield, title: t("about_card1_title"), desc: t("about_card1_desc") },
    { icon: Clock, title: t("about_card2_title"), desc: t("about_card2_desc") },
    { icon: MapPin, title: t("about_card3_title"), desc: t("about_card3_desc") },
  ];
  return (
    <>
      <div className="px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-ink p-7 text-white sm:p-12 sm:text-center">
          <Eyebrow className="bg-white/10 text-white">{t("about_badge")}</Eyebrow>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-[34px] font-bold leading-[1.02] sm:text-[52px]">{t("about_title")} {t("about_title2")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-white/65">{t("about_p1")}</p>
        </div>
      </div>
      <section className="mx-auto max-w-4xl px-3 py-8 sm:px-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title as string} delay={i * 0.06}>
              <div className="h-full rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container"><c.icon className="h-6 w-6 text-on-primary-container" /></span>
                <h3 className="mt-4 font-display text-[16px] font-bold">{c.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-on-surface-variant">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-4 rounded-[28px] bg-surface-container p-7 sm:p-8">
          <h2 className="font-display text-[20px] font-bold">{t("about_how_title")}</h2>
          <ul className="mt-4 space-y-2.5 text-[14px] leading-6">
            {[t("about_how_li1"), t("about_how_li2"), t("about_how_li3"), t("about_how_li4")].map((li) => (
              <li key={li as string} className="flex gap-2.5 rounded-2xl bg-surface-container-lowest px-4 py-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />{li}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 rounded-[32px] bg-primary p-7 text-white sm:p-8">
          <h2 className="font-display text-[22px] font-bold">{t("about_cta_title")}</h2>
          <p className="mt-2 max-w-xl text-[14px] leading-7 text-white/80">{t("about_cta_desc")}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link href="/voitures" className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-bold text-ink">Voir les voitures <ArrowRight className="h-5 w-5" /></Link>
            <a href="https://wa.me/212661689659" target="_blank" className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-white/30 px-7 text-[15px] font-bold">WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
