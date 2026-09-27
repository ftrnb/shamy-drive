"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Fuel, Settings2, Users, Star, MapPin, MessageCircle, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export default function CarDetailContent({ car, validImages, avgRating, waUrl }: { car: any; validImages: any[]; avgRating: number | null; waUrl: string }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const main = validImages[active]?.url || validImages[0]?.url || "/cars/Loganblanche.png";

  return (
    <>
      <div className="px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <Link href="/voitures" className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-surface-container-lowest px-5 text-[14px] font-bold shadow-m3-1 transition hover:bg-surface-container">
            <ArrowLeft className="h-4 w-4" /> {t("detail_back")}
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-3 py-5 sm:px-5">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest shadow-m3-1">
            <div className="img-fade relative flex min-h-[320px] items-center justify-center p-6 sm:min-h-[440px] sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div key={main} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="relative h-[280px] w-full sm:h-[380px]">
                  <Image src={main} alt={`${car.brand} ${car.model}`} fill sizes="(max-width: 1024px) 90vw, 640px" className="object-contain drop-shadow-2xl" priority />
                </motion.div>
              </AnimatePresence>
              <div className="absolute left-5 top-5 flex gap-1.5">
                <span className="rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-bold text-white">{car.category}</span>
              </div>
              {avgRating != null && (
                <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-surface-container-lowest/95 px-3 py-1.5 text-[13px] font-bold shadow-m3-1">
                  <Star className="h-4 w-4 fill-primary text-primary" /> {avgRating.toFixed(1)} <span className="font-medium text-on-surface-variant">({car.reviews.length})</span>
                </div>
              )}
            </div>
            {validImages.length > 1 && (
              <div className="snap-row no-scrollbar flex gap-2 overflow-x-auto border-t border-outline-variant/40 bg-surface-container-low p-4">
                {validImages.map((img: any, i: number) => (
                  <button
                    key={img.id || i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Photo ${i + 1}`}
                    aria-pressed={i === active}
                    className={cn("relative h-[72px] w-[104px] shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition-all duration-200 hover:scale-105 active:scale-95 dark:bg-surface-container-low", i === active ? "border-primary shadow-m3-1" : "border-transparent hover:border-outline-variant")}
                  >
                    <span className="relative block h-full w-full">
                      <Image src={img.url} alt="" fill sizes="104px" className="object-contain" />
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2.5 border-t border-outline-variant/40 p-5 text-[13px] sm:grid-cols-3">
              {[
                `${t("detail_transmission")}: ${car.transmission === "AUTOMATIC" ? t("vehicles_automatic") : t("vehicles_manual")}`,
                `${t("detail_fuel")}: ${car.fuel}`,
                `${t("detail_seats")}: ${car.seats}`,
                `${t("detail_mileage")}: ${t("detail_unlimited")}`,
                "Climatisation",
                "Bluetooth / USB",
              ].map((x) => (
                <span key={x} className="inline-flex items-center gap-1.5 rounded-2xl bg-surface-container px-3 py-2.5 font-medium transition-colors duration-200 hover:bg-surface-container-high"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> {x}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col rounded-[32px] bg-ink p-6 text-white shadow-m3-2 sm:p-8 lg:sticky lg:top-24 lg:self-start">
            <p className="text-[13px] font-bold uppercase tracking-widest text-tertiary-container">{car.brand}</p>
            <h1 className="mt-1 font-display text-[34px] font-bold leading-none sm:text-[42px]">{car.model}</h1>
            <div className="mt-5 rounded-[20px] bg-white/[0.06] p-5">
              <p className="text-[12px] font-bold uppercase tracking-widest text-white/50">{t("detail_tariff")}</p>
              <p className="mt-1"><span className="font-display text-[36px] font-bold">{car.pricePerDay} DH</span> <span className="text-[14px] text-white/55">{t("detail_day")}</span></p>
              <p className="mt-1 text-[12px] leading-5 text-white/55">{t("detail_included")}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { icon: Settings2, l: t("detail_transmission"), v: car.transmission === "AUTOMATIC" ? t("vehicles_automatic") : t("vehicles_manual") },
                { icon: Fuel, l: t("detail_fuel"), v: car.fuel },
                { icon: Users, l: t("detail_seats"), v: `${car.seats}` },
                { icon: MapPin, l: t("detail_mileage"), v: t("detail_unlimited") },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/[0.06] p-4">
                  <s.icon className="h-5 w-5 text-tertiary-container" />
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-white/50">{s.l}</p>
                  <p className="text-[14px] font-bold">{s.v}</p>
                </div>
              ))}
            </div>
            {car.description && <p className="mt-5 text-[14px] leading-7 text-white/65">{car.description}</p>}
            <div className="mt-5 space-y-2 text-[13px] text-white/70">
              {[t("detail_verified"), t("detail_assistance"), t("detail_delivery")].map((x) => (
                <p key={x} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-container" /> {x}</p>
              ))}
            </div>
            <div className="mt-6 space-y-2 pb-16 lg:pb-0">
              <Link href={`/reservation/${car.id}`} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-bold text-white shadow-m3-2 transition hover:brightness-110 active:scale-[0.98]">
                <CalendarCheck className="h-5 w-5" /> {t("detail_book")}
              </Link>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-success px-6 text-[15px] font-bold text-white transition hover:brightness-110 active:scale-[0.98]">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            [t("detail_flexible"), t("detail_flexible_desc")],
            [t("detail_no_hidden"), t("detail_no_hidden_desc")],
            [t("detail_support"), t("detail_support_desc")],
          ].map(([a, b], i) => (
            <Reveal key={a as string} delay={i * 0.07}>
            <div className="h-full rounded-[24px] border border-outline-variant/40 bg-surface-container-lowest p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-m3-2">
              <CheckCircle2 className="h-6 w-6 text-primary transition-transform duration-300 hover:scale-125" />
              <h3 className="mt-3 font-display text-[16px] font-bold">{a}</h3>
              <p className="mt-1 text-[13px] leading-6 text-on-surface-variant">{b}</p>
            </div>
            </Reveal>
          ))}
        </div>

        {car.reviews.length > 0 && (
          <Reveal>
          <div className="mt-4 rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8">
            <h3 className="font-display text-[18px] font-bold">{t("detail_reviews")} ({car.reviews.length})</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {car.reviews.slice(0, 4).map((r: any) => (
                <div key={r.id} className="rounded-2xl bg-surface-container p-4 transition-all duration-200 hover:bg-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold">{r.user.name || "Client vérifié"}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-lowest px-2.5 py-1 text-[12px] font-bold"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> {r.rating}/5</span>
                  </div>
                  {r.comment && <p className="mt-2 text-[13px] leading-6 text-on-surface-variant">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
          </Reveal>
        )}
      </section>

      {/* Sticky mobile booking bar */}
      <div className="fixed inset-x-3 bottom-[84px] z-40 md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-full border border-white/10 bg-ink/95 p-2 pl-5 text-white shadow-m3-3 backdrop-blur-xl">
          <div><p className="text-[16px] font-bold leading-none">{car.pricePerDay} DH<span className="text-[12px] font-medium text-white/55">/j</span></p><p className="mt-1 text-[11px] text-white/55">Km illimité inclus</p></div>
          <Link href={`/reservation/${car.id}`} className="flex min-h-[52px] items-center rounded-full bg-primary px-6 text-[14px] font-bold">Réserver</Link>
        </div>
      </div>
      <div className="h-28 md:hidden" />
    </>
  );
}
