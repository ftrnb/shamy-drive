"use client";

import { Shield, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function AproposContent() {
  const { t } = useLanguage();
  return (
    <>
      <div className="bg-[#0A0A0A] px-6 pb-12 pt-28 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#C1272D]">{t("about_badge")}</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">{t("about_title")}<br />{t("about_title2")}</h1>
          <p className="mt-6 text-sm leading-7 text-zinc-300">{t("about_p1")}</p>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="border border-zinc-200 p-6">
            <Shield className="h-6 w-6 text-[#C1272D]" />
            <h3 className="mt-3 text-sm font-black uppercase">{t("about_card1_title")}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{t("about_card1_desc")}</p>
          </div>
          <div className="border border-zinc-200 p-6">
            <Clock className="h-6 w-6 text-[#C1272D]" />
            <h3 className="mt-3 text-sm font-black uppercase">{t("about_card2_title")}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{t("about_card2_desc")}</p>
          </div>
          <div className="border border-zinc-200 p-6">
            <MapPin className="h-6 w-6 text-[#C1272D]" />
            <h3 className="mt-3 text-sm font-black uppercase">{t("about_card3_title")}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{t("about_card3_desc")}</p>
          </div>
        </div>

        <div className="mt-12 border border-zinc-200 bg-zinc-50 p-8">
          <h2 className="text-lg font-black uppercase">{t("about_how_title")}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600">
            <li>{t("about_how_li1")}</li>
            <li>{t("about_how_li2")}</li>
            <li>{t("about_how_li3")}</li>
            <li>{t("about_how_li4")}</li>
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-black uppercase">{t("about_cta_title")}</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">{t("about_cta_desc")}</p>
        </div>
      </section>
    </>
  );
}
