"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, Fuel, Gauge, Settings2, Users, Star, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function CarDetailContent({ car, validImages, avgRating, waUrl }: { car: any; validImages: any[]; avgRating: number | null; waUrl: string }) {
  const { t } = useLanguage();
  const mainImageUrl = validImages[0]?.url || "/shamydrive.png";
  return (
    <>
      <div className="bg-[#0A0A0A] px-6 pb-6 pt-24">
        <div className="mx-auto max-w-7xl">
          <Link href="/voitures" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {t("detail_back")}
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="overflow-hidden border border-zinc-200 bg-white">
            <div className="relative flex min-h-[420px] items-center justify-center bg-zinc-100 p-8 sm:min-h-[520px]">
              <Image src={mainImageUrl} alt={`${car.brand} ${car.model}`} width={1000} height={700} className="h-auto max-h-[460px] w-full object-contain" priority />
              <div className="absolute left-4 top-4 bg-[#C1272D] px-3 py-2 text-xs font-black uppercase tracking-widest text-white">{car.category}</div>
              {avgRating && (
                <div className="absolute right-4 top-4 flex items-center gap-1 bg-white px-3 py-2 text-sm font-bold shadow">
                  <Star className="h-4 w-4 fill-[#C1272D] text-[#C1272D]" /> {avgRating.toFixed(1)} ({car.reviews.length})
                </div>
              )}
            </div>
            {validImages.length > 1 ? (
              <div className="flex gap-2 border-t border-zinc-200 p-4">
                {validImages.map((img: any) => (
                  <div key={img.id} className="relative h-20 w-28 border border-zinc-200 bg-zinc-50 p-2">
                    <Image src={img.url} alt={`${car.brand} ${car.model} — photo`} fill sizes="112px" className="object-contain" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-zinc-200 bg-white p-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">{t("detail_no_hidden")} — {t("detail_unlimited")}</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C1272D]" /> {t("detail_transmission")}: {car.transmission === "AUTOMATIC" ? t("vehicles_automatic") : t("vehicles_manual")}</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C1272D]" /> {t("detail_fuel")}: {car.fuel}</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C1272D]" /> {t("detail_seats")}: {car.seats}</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C1272D]" /> {t("detail_mileage")}: {t("detail_unlimited")}</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C1272D]" /> Climatisation</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C1272D]" /> Bluetooth / USB</div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
                  <MapPin className="h-4 w-4 text-[#C1272D]" />
                  {t("detail_delivery")} — {t("detail_assistance")}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col bg-white p-7 shadow-sm sm:p-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#C1272D]">{car.brand}</p>
              <h1 className="mt-1 text-4xl font-black uppercase leading-none sm:text-5xl">{car.model}</h1>

              <div className="mt-6 border-y border-zinc-200 py-6">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">{t("detail_tariff")}</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-black">{car.pricePerDay} DH</span>
                  <span className="pb-1 text-sm text-zinc-400">{t("detail_day")}</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">{t("detail_included")}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="border border-zinc-200 p-4">
                  <Settings2 className="h-5 w-5 text-[#C1272D]" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t("detail_transmission")}</p>
                  <p className="text-sm font-black">{car.transmission === "AUTOMATIC" ? t("vehicles_automatic") : t("vehicles_manual")}</p>
                </div>
                <div className="border border-zinc-200 p-4">
                  <Fuel className="h-5 w-5 text-[#C1272D]" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t("detail_fuel")}</p>
                  <p className="text-sm font-black">{car.fuel}</p>
                </div>
                <div className="border border-zinc-200 p-4">
                  <Users className="h-5 w-5 text-[#C1272D]" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t("detail_seats")}</p>
                  <p className="text-sm font-black">{car.seats} {t("detail_seats").toLowerCase()}</p>
                </div>
                <div className="border border-zinc-200 p-4">
                  <Gauge className="h-5 w-5 text-[#C1272D]" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t("detail_mileage")}</p>
                  <p className="text-sm font-black">{t("detail_unlimited")}</p>
                </div>
              </div>

              {car.description && <p className="mt-6 text-sm leading-7 text-zinc-600">{car.description}</p>}

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-zinc-600"><CheckCircle2 className="h-5 w-5 text-[#C1272D]" /> {t("detail_verified")}</div>
                <div className="flex items-center gap-2 text-sm text-zinc-600"><CheckCircle2 className="h-5 w-5 text-[#C1272D]" /> {t("detail_assistance")}</div>
                <div className="flex items-center gap-2 text-sm text-zinc-600"><MapPin className="h-5 w-5 text-[#C1272D]" /> {t("detail_delivery")}</div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link href={`/reservation/${car.id}`} className="flex w-full items-center justify-center gap-2 bg-[#C1272D] px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-black">
                {t("detail_book")}
              </Link>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 border-2 border-green-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-green-600 transition hover:bg-green-600 hover:text-white">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="border border-zinc-200 bg-white p-6">
            <CalendarDays className="h-6 w-6 text-[#C1272D]" />
            <h3 className="mt-3 text-sm font-black uppercase">{t("detail_flexible")}</h3>
            <p className="mt-2 text-sm text-zinc-500">{t("detail_flexible_desc")}</p>
          </div>
          <div className="border border-zinc-200 bg-white p-6">
            <CheckCircle2 className="h-6 w-6 text-[#C1272D]" />
            <h3 className="mt-3 text-sm font-black uppercase">{t("detail_no_hidden")}</h3>
            <p className="mt-2 text-sm text-zinc-500">{t("detail_no_hidden_desc")}</p>
          </div>
          <div className="border border-zinc-200 bg-white p-6">
            <Users className="h-6 w-6 text-[#C1272D]" />
            <h3 className="mt-3 text-sm font-black uppercase">{t("detail_support")}</h3>
            <p className="mt-2 text-sm text-zinc-500">{t("detail_support_desc")}</p>
          </div>
        </div>

        {car.reviews.length > 0 && (
          <div className="mt-8 border border-zinc-200 bg-white p-6">
            <h3 className="text-sm font-black uppercase tracking-widest">{t("detail_reviews")} ({car.reviews.length})</h3>
            <div className="mt-4 space-y-4">
              {car.reviews.map((r: any) => (
                <div key={r.id} className="border-b border-zinc-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{r.user.name || "Client"}</span>
                    <span className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-[#C1272D] text-[#C1272D]" /> {r.rating}/5</span>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-zinc-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
