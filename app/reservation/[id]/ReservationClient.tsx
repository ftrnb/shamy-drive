"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays, CheckCircle2, MapPin, User, Phone, Mail, Clock, Upload, FileText, Shield, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { calculateDays } from "@/lib/utils";
import { readSearch } from "@/lib/search-memory";
import { useLanguage } from "@/lib/language-context";
import { MField, fieldInput } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Motion";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

const LOCATIONS = ["Agadir Aéroport Al Massira", "Agadir Centre Ville", "Taghazout", "Tamraght", "Aourir", "Essaouira", "Marrakech"];
const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

export default function ReservationClient({ car, initialStartDate, initialEndDate }: { car: any; initialStartDate: string; initialEndDate: string }) {
  const [user, setUser] = useState<any>(null);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let alive = true;
    supabase.auth
      .getUser()
      .then(({ data: { user } }: any) => {
        if (alive) setUser(user);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [supabase]);

  const [step, setStep] = useState(0);
  // Prefill from the last home search when the URL carries no dates
  const [startDate, setStartDate] = useState(() => initialStartDate || readSearch().pickupDate || "");
  const [endDate, setEndDate] = useState(() => initialEndDate || readSearch().returnDate || "");
  const [pickupLocation, setPickupLocation] = useState(() => {
    const loc = readSearch().location;
    return loc && LOCATIONS.includes(loc) ? loc : LOCATIONS[0];
  });
  const [dropoffLocation, setDropoffLocation] = useState(() => {
    const loc = readSearch().location;
    return loc && LOCATIONS.includes(loc) ? loc : LOCATIONS[0];
  });
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [identityUrl, setIdentityUrl] = useState<string | null>(null);
  const [identityPublicId, setIdentityPublicId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Keep the current step in view on mobile when advancing
  const topRef = useRef<HTMLFormElement>(null);
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [step, reduceMotion]);

  const booking = useMemo(() => {
    if (!startDate || !endDate) return { days: 0, total: 0, valid: false };
    const days = calculateDays(`${startDate}T00:00:00`, `${endDate}T00:00:00`);
    if (days <= 0) return { days: 0, total: 0, valid: false };
    return { days, total: days * car.pricePerDay, valid: true };
  }, [startDate, endDate, car.pricePerDay]);

  const steps = [lang === "fr" ? "Trajet" : "Trip", lang === "fr" ? "Conducteur" : "Driver", lang === "fr" ? "Confirmer" : "Confirm"];

  function canNext() {
    if (step === 0) return booking.valid;
    if (step === 1) return customerName.trim().length >= 2 && customerPhone.trim().length >= 8 && !!identityUrl && !uploadingId;
    return true;
  }

  async function handleIdUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(lang === "fr" ? "Fichier trop volumineux (max 5MB)" : "File too large (max 5MB)");
      return;
    }
    setUploadingId(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setIdentityUrl(data.url);
      setIdentityPublicId(data.publicId);
    } catch (err: any) {
      setError(err.message || "Upload échoué");
    } finally {
      setUploadingId(false);
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user) {
      router.push(`/login?callbackUrl=/reservation/${car.id}?startDate=${startDate}&endDate=${endDate}`);
      return;
    }
    if (!booking.valid) { setError(lang === "fr" ? "Choisis des dates valides." : "Choose valid dates."); setStep(0); return; }
    if (!identityUrl) { setError(lang === "fr" ? "Ajoute ta pièce d’identité — obligatoire." : "Upload your ID — required."); setStep(1); return; }
    if (!termsAccepted) { setError(lang === "fr" ? "Accepte les conditions pour continuer." : "Accept terms."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: car.id, startDate, endDate, customerName, customerPhone, customerEmail, pickupLocation, dropoffLocation, pickupTime, dropoffTime, notes, identityDocumentUrl: identityUrl, identityDocumentPublicId: identityPublicId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Réservation échouée"); return; }
      setSuccess(`${t("reservation_success")} Réf: ${data.booking.id.slice(0, 8).toUpperCase()}`);
      toast(t("reservation_success"), { desc: `${car.brand} ${car.model} • ${booking.days} j — ${booking.total} DH` });
      setTimeout(() => router.push("/compte"), 1800);
    } catch {
      setError(lang === "fr" ? "Erreur réseau" : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const waMsg = `Bonjour Shamy Drive\nJe souhaite réserver ${car.brand} ${car.model} du ${startDate || "—"} (${pickupTime}) au ${endDate || "—"} (${dropoffTime}) — ${pickupLocation} → ${dropoffLocation}\nDurée: ${booking.days ? `${booking.days}j` : "—"} — Total: ${booking.total ? `${booking.total} DH` : "—"}\nNom: ${customerName || "—"}\nTél: ${customerPhone || "—"}\nMerci de confirmer.`;
  const waUrl = `https://wa.me/212661689659?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Summary */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest shadow-m3-1">
          <div className="img-fade relative flex h-[240px] items-center justify-center p-6 sm:h-[280px]">
            <img src={car.images[0]?.url || "/cars/Loganblanche.png"} alt={`${car.brand} ${car.model}`} className="h-full w-full object-contain drop-shadow-xl" />
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold text-white">{car.category}</span>
            <span className="absolute bottom-4 right-4 rounded-full bg-primary px-4 py-2 text-white"><span className="text-[16px] font-bold">{car.pricePerDay} DH</span><span className="ml-1 text-[12px] text-white/70">/j</span></span>
          </div>
          <div className="p-6">
            <p className="text-[12px] font-bold uppercase tracking-widest text-primary">{car.brand}</p>
            <h2 className="font-display text-[24px] font-bold">{car.model}</h2>
            <div className="mt-4 rounded-2xl bg-surface-container p-4 text-[14px]">
              <div className="flex justify-between"><span className="text-on-surface-variant">{t("reservation_duration")}</span><span className="font-bold">{booking.days ? `${booking.days} j` : "—"}</span></div>
              <div className="mt-1.5 flex justify-between gap-3"><span className="shrink-0 text-on-surface-variant">Trajet</span><span className="truncate text-right text-[13px] font-semibold">{pickupLocation} → {dropoffLocation}</span></div>
              <div className="mt-3 flex items-center justify-between border-t border-outline-variant/50 pt-3"><span className="font-bold">{t("reservation_total")}</span><motion.span key={booking.total} initial={reduceMotion ? false : { scale: 0.85, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 18, stiffness: 400 }} className="font-display text-[24px] font-bold">{booking.total ? `${booking.total} DH` : "—"}</motion.span></div>
              <p className="mt-1 text-[12px] text-on-surface-variant">Km illimité • Assurance incluse</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                [Shield, lang === "fr" ? "Vérifié" : "Checked"],
                [MapPin, lang === "fr" ? "Livraison" : "Delivery"],
                [CheckCircle2, lang === "fr" ? "Sans acompte" : "No deposit"],
              ].map(([Icon, label]: any, i: number) => (
                <div key={i} className="rounded-2xl border border-outline-variant/40 px-2 py-3">
                  <Icon className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 text-[11px] font-bold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <form ref={topRef} onSubmit={handleSubmit} className="scroll-mt-24 overflow-hidden rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest shadow-m3-1">
        <div className="bg-ink px-6 py-5 text-white">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => { if (i < step) setStep(i); }}
                  className={cn("flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-[13px] font-bold transition", i === step ? "bg-primary text-white" : i < step ? "bg-success-container text-on-success-container" : "bg-white/10 text-white/50")}
                  aria-current={i === step ? "step" : undefined}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : `0${i + 1}`}
                </button>
                <span className={cn("hidden text-[13px] font-bold sm:block", i === step ? "text-white" : "text-white/45")}>{s}</span>
                {i < steps.length - 1 && <span className="h-px flex-1 bg-white/15" />}
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${((step + 1) / 3) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="space-y-4">
                <h3 className="flex items-center gap-2 font-display text-[18px] font-bold"><MapPin className="h-5 w-5 text-primary" /> {lang === "fr" ? "Où et quand ?" : "Where & when?"}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <MField label={t("reservation_pickup")}>
                    <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className={fieldInput}>{LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}</select>
                  </MField>
                  <MField label={t("reservation_dropoff")}>
                    <select value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} className={fieldInput}>{LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}</select>
                  </MField>
                  <MField label={t("reservation_pickup_date")} icon={<CalendarDays className="h-4 w-4" />}>
                    <input type="date" min={getToday()} value={startDate} onChange={(e) => { setStartDate(e.target.value); if (endDate && e.target.value >= endDate) setEndDate(""); }} className={fieldInput} required />
                  </MField>
                  <MField label={t("reservation_pickup_time")}>
                    <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className={fieldInput}>{TIMES.map((x) => <option key={x} value={x}>{x}</option>)}</select>
                  </MField>
                  <MField label={t("reservation_dropoff_date")} icon={<CalendarDays className="h-4 w-4" />}>
                    <input type="date" min={startDate || getToday()} value={endDate} onChange={(e) => setEndDate(e.target.value)} className={fieldInput} required />
                  </MField>
                  <MField label={t("reservation_dropoff_time")}>
                    <select value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} className={fieldInput}>{TIMES.map((x) => <option key={x} value={x}>{x}</option>)}</select>
                  </MField>
                </div>
                {!booking.valid && <p className="rounded-2xl bg-tertiary-container/40 px-4 py-3 text-[13px] font-medium">Choisis des dates valides pour voir le total.</p>}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="space-y-4">
                <h3 className="flex items-center gap-2 font-display text-[18px] font-bold"><User className="h-5 w-5 text-primary" /> {t("reservation_customer")}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <MField label={t("reservation_name")}><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ex : Yasmine El Fassi" className={fieldInput} required /></MField>
                  <MField label={t("reservation_phone")} icon={<Phone className="h-4 w-4" />}><input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+212 6 ..." inputMode="tel" className={fieldInput} required /></MField>
                </div>
                <MField label={t("reservation_email")} icon={<Mail className="h-4 w-4" />}><input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="toi@email.com" className={fieldInput} /></MField>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-on-surface-variant"><FileText className="h-4 w-4 text-primary" /> {t("reservation_id")} <span className="text-error">*</span></p>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[20px] border-2 border-dashed border-outline-variant bg-surface-container px-5 py-5 transition hover:border-primary hover:bg-surface-container-low">
                    <span className="flex items-center gap-2.5 text-[14px] font-semibold"><Upload className="h-5 w-5 text-primary" />{uploadingId ? "..." : identityUrl ? (lang === "fr" ? "Remplacer" : "Replace") : (lang === "fr" ? "Ajouter CIN / passeport" : "Add ID")}</span>
                    <span className="text-[12px] text-outline">JPG • PNG • PDF — 5MB</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleIdUpload} className="hidden" />
                  </label>
                  {identityUrl && <p className="mt-2.5 flex items-center gap-2 rounded-2xl bg-success-container/60 px-4 py-2.5 text-[13px] font-semibold text-on-success-container"><CheckCircle2 className="h-4 w-4" /> Pièce ajoutée — <a href={identityUrl} target="_blank" className="underline">voir</a></p>}
                  <p className="mt-2 text-[12px] text-outline">{t("reservation_id_hint")}</p>
                </div>
                <MField label={t("reservation_notes")}><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder={t("reservation_notes_placeholder")} className={`${fieldInput} h-auto min-h-[88px] py-3`} /></MField>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="space-y-4">
                <h3 className="font-display text-[18px] font-bold">{t("reservation_summary")}</h3>
                <div className="rounded-[20px] bg-surface-container p-5 text-[14px]">
                  <div className="flex justify-between"><span className="text-on-surface-variant">{t("reservation_vehicle")}</span><span className="font-bold">{car.brand} {car.model}</span></div>
                  <div className="mt-2 flex justify-between"><span className="text-on-surface-variant">{t("reservation_duration")}</span><span className="font-bold">{booking.days} j</span></div>
                  <div className="mt-2 flex justify-between gap-3"><span className="text-on-surface-variant">Dates</span><span className="text-right font-semibold">{startDate} → {endDate}</span></div>
                  <div className="mt-2 flex justify-between gap-3"><span className="text-on-surface-variant">Contact</span><span className="text-right font-semibold">{customerName || "—"} • {customerPhone || "—"}</span></div>
                  <div className="mt-3 flex items-center justify-between border-t border-outline-variant/50 pt-3"><span className="font-bold">Total</span><motion.span key={booking.total} initial={reduceMotion ? false : { scale: 0.85, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 18, stiffness: 400 }} className="font-display text-[26px] font-bold">{booking.total} DH</motion.span></div>
                </div>
                <label className="flex cursor-pointer gap-3 rounded-2xl border border-outline-variant/50 p-4 text-[13px] leading-6">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#c1272d]" />
                  {t("reservation_terms")}
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p role="alert" className="mt-4 rounded-2xl bg-error-container/60 px-4 py-3 text-[13px] font-semibold text-error">{error}</p>}
          {success && <motion.p role="status" initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 16, stiffness: 350 }} className="mt-4 rounded-2xl bg-success-container/70 px-4 py-3 text-[13px] font-semibold text-on-success-container">{success}</motion.p>}

          <div className="mt-6 flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="flex h-[56px] min-w-[56px] items-center justify-center rounded-full border border-outline-variant px-5 transition hover:bg-surface-container" aria-label="Retour">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            {step < 2 ? (
              <button type="button" onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className={cn("flex h-[56px] flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-bold transition active:scale-[0.98]", canNext() ? "bg-ink text-white hover:bg-primary" : "cursor-not-allowed bg-surface-container text-outline")}>
                Continuer <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button type="submit" disabled={loading || !booking.valid || uploadingId} className={cn("flex h-[56px] flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-bold transition active:scale-[0.98]", booking.valid ? "bg-primary text-white shadow-m3-1 hover:brightness-110" : "cursor-not-allowed bg-surface-container text-outline")}>
                {loading ? <Spinner /> : null}
                {!user ? t("reservation_login_required") : loading ? (lang === "fr" ? "Envoi..." : "Sending...") : t("reservation_submit")}
              </button>
            )}
          </div>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="mt-2.5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-success-container px-6 text-[14px] font-bold text-on-success-container transition hover:brightness-95">
            <MessageCircle className="h-5 w-5" /> {t("reservation_whatsapp")}
          </a>
          <p className="mt-3 flex gap-2 text-[12px] leading-5 text-outline"><Clock className="h-4 w-4 shrink-0 text-primary" /> {lang === "fr" ? "Confirmation par l'équipe. Paiement à la livraison." : "Confirmed by the team. Pay on delivery."}</p>
        </div>
      </form>
    </div>
  );
}
