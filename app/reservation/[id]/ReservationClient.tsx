"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CalendarDays, CheckCircle2, MapPin, User, Phone, Mail, Clock, Upload, FileText, Shield } from "lucide-react";
import { calculateDays } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

const LOCATIONS = ["Agadir Aéroport Al Massira", "Agadir Centre Ville", "Taghazout", "Tamraght", "Aourir", "Essaouira", "Marrakech"];
const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

export default function ReservationClient({ car, initialStartDate, initialEndDate }: { car: any; initialStartDate: string; initialEndDate: string }) {
  const { status } = useSession();
  const router = useRouter();
  const { lang, t } = useLanguage();

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [pickupLocation, setPickupLocation] = useState("Agadir Aéroport Al Massira");
  const [dropoffLocation, setDropoffLocation] = useState("Agadir Aéroport Al Massira");
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

  const booking = useMemo(() => {
    if (!startDate || !endDate) return { days: 0, total: 0, valid: false };
    const s = new Date(`${startDate}T00:00:00`);
    const e = new Date(`${endDate}T00:00:00`);
    const days = calculateDays(s, e);
    if (days <= 0) return { days: 0, total: 0, valid: false };
    return { days, total: days * car.pricePerDay, valid: true };
  }, [startDate, endDate, car.pricePerDay]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/reservation/${car.id}?startDate=${startDate}&endDate=${endDate}`);
      return;
    }
    if (!booking.valid) {
      setError(lang === "fr" ? "Choisis des dates valides." : "Choose valid dates.");
      return;
    }
    if (!identityUrl) {
      setError(lang === "fr" ? "Merci d'ajouter ta pièce d'identité (CIN/Passeport) — obligatoire pour confirmer." : "Please upload your ID (CIN/Passport) — required.");
      return;
    }
    if (!termsAccepted) {
      setError(lang === "fr" ? "Accepte les conditions pour continuer." : "Accept terms to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          startDate,
          endDate,
          customerName,
          customerPhone,
          customerEmail,
          pickupLocation,
          dropoffLocation,
          pickupTime,
          dropoffTime,
          notes,
          identityDocumentUrl: identityUrl,
          identityDocumentPublicId: identityPublicId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Réservation échouée");
        return;
      }
      setSuccess(`${t("reservation_success")} Réf: ${data.booking.id.slice(0, 8).toUpperCase()}`);
      setTimeout(() => router.push("/compte"), 1500);
    } catch {
      setError(lang === "fr" ? "Erreur réseau" : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const whatsappMsg = `Bonjour Shamy Drive 👋\n\nJe souhaite réserver ${car.brand} ${car.model} du ${startDate || "—"} (${pickupTime}) au ${endDate || "—"} (${dropoffTime}) — ${pickupLocation} → ${dropoffLocation}\nDurée: ${booking.days ? `${booking.days}j` : "—"} — Total: ${booking.total ? `${booking.total} DH` : "—"}\nNom: ${customerName || "—"}\nTél: ${customerPhone || "—"}\nMerci de confirmer.`;
  const waUrl = `https://wa.me/212661689659?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      {/* LEFT — Car */}
      <div className="space-y-6">
        <div className="overflow-hidden border border-zinc-200 bg-white">
          <div className="relative flex h-[340px] items-center justify-center bg-gradient-to-b from-zinc-50 to-white p-8 sm:h-[420px]">
            <img src={car.images[0]?.url || "/cars/Loganblanche.png"} alt={`${car.brand} ${car.model}`} className="h-full w-full object-contain drop-shadow-xl" />
            <div className="absolute left-4 top-4 flex gap-2">
              <span className="bg-[#C1272D] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">{car.category}</span>
              <span className="bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black border border-zinc-200">{t("reservation_unlimited")}</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-[#0A0A0A] px-4 py-3 text-white">
              <span className="text-xl font-black">{car.pricePerDay} DH</span>
              <span className="ml-1 text-xs text-zinc-400">/ {lang === "fr" ? "jour" : "day"}</span>
            </div>
          </div>
          <div className="p-6 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C1272D]">{car.brand}</p>
            <h2 className="mt-1 text-2xl font-black uppercase">{car.model}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">{car.description || (lang === "fr" ? "Véhicule récent, entretenu, prêt à Agadir. Kilométrage illimité inclus." : "Recent, maintained, ready in Agadir. Unlimited mileage included.")}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{lang === "fr" ? "Boîte" : "Gear"}</p>
                <p className="mt-1 text-sm font-black">{car.transmission === "AUTOMATIC" ? (lang === "fr" ? "Auto" : "Auto") : lang === "fr" ? "Manuelle" : "Manual"}</p>
              </div>
              <div className="border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{lang === "fr" ? "Places" : "Seats"}</p>
                <p className="mt-1 text-sm font-black">{car.seats}</p>
              </div>
              <div className="border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{lang === "fr" ? "Année" : "Year"}</p>
                <p className="mt-1 text-sm font-black">{car.year || "2023"}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-4">
              <div className="text-center">
                <Shield className="mx-auto h-5 w-5 text-[#C1272D]" />
                <p className="mt-1 text-[10px] font-black uppercase tracking-wider">{lang === "fr" ? "Contrôle 25 points" : "25-point check"}</p>
                <p className="text-[11px] text-zinc-500">{lang === "fr" ? "Vérifié" : "Verified"}</p>
              </div>
              <div className="text-center border-x border-zinc-100">
                <Clock className="mx-auto h-5 w-5 text-[#C1272D]" />
                <p className="mt-1 text-[10px] font-black uppercase tracking-wider">{lang === "fr" ? "Livraison 30 min" : "30-min delivery"}</p>
                <p className="text-[11px] text-zinc-500">{lang === "fr" ? "Aéroport" : "Airport"}</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-5 w-5 text-[#C1272D]" />
                <p className="mt-1 text-[10px] font-black uppercase tracking-wider">{lang === "fr" ? "Assistance 24/7" : "24/7 support"}</p>
                <p className="text-[11px] text-zinc-500">WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-zinc-200 bg-white p-6">
          <h3 className="text-sm font-black uppercase tracking-widest">{lang === "fr" ? "Garanties Shamy Drive" : "Shamy Drive Guarantees"}</h3>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-zinc-600">
            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#C1272D]" /> <span><strong>{lang === "fr" ? "Kilométrage illimité" : "Unlimited mileage"}</strong> — {lang === "fr" ? "roulez d'Agadir à Marrakech sans supplément, carburant non inclus." : "drive from Agadir to Marrakech no extra, fuel not included."}</span></li>
            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#C1272D]" /> <span><strong>{lang === "fr" ? "Véhicule désinfecté" : "Sanitized vehicle"}</strong> — {lang === "fr" ? "intérieur/ extérieur nettoyé, contrôle pression & niveaux avant chaque location." : "interior/exterior cleaned, pressure & fluids checked before each rental."}</span></li>
            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#C1272D]" /> <span><strong>{lang === "fr" ? "Paiement à la livraison" : "Pay on delivery"}</strong> — {lang === "fr" ? "aucune caution bloquée en ligne, règlement à la remise des clés." : "no deposit blocked online, pay when you get the keys."}</span></li>
          </ul>
        </div>
      </div>

      {/* RIGHT — Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 shadow-sm">
        <div className="bg-[#0A0A0A] px-6 py-5 text-white">
          <h2 className="text-lg font-black uppercase tracking-wide">{t("reservation_title")}</h2>
          <p className="mt-1 text-xs text-zinc-400">{lang === "fr" ? "Prix calculé en temps réel • Vérification anti-chevauchement serveur" : "Real-time pricing • Server-side availability check"}</p>
        </div>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Locations & Times */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-700"><MapPin className="h-4 w-4 text-[#C1272D]" /> {lang === "fr" ? "Trajet" : "Trip"}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t("reservation_pickup")}</label>
                <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="w-full border border-zinc-300 bg-white px-3 py-3 text-sm focus:border-[#C1272D] focus:ring-1 focus:ring-[#C1272D] outline-none">
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t("reservation_dropoff")}</label>
                <select value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} className="w-full border border-zinc-300 bg-white px-3 py-3 text-sm focus:border-[#C1272D] outline-none">
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t("reservation_pickup_date")}</label>
                <input type="date" min={getToday()} value={startDate} onChange={(e) => { setStartDate(e.target.value); if (endDate && e.target.value >= endDate) setEndDate(""); }} className="w-full border border-zinc-300 px-3 py-3 text-sm focus:border-[#C1272D] outline-none" required />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t("reservation_pickup_time")}</label>
                <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full border border-zinc-300 px-3 py-3 text-sm">
                  {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t("reservation_dropoff_date")}</label>
                <input type="date" min={startDate || getToday()} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-zinc-300 px-3 py-3 text-sm focus:border-[#C1272D] outline-none" required />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t("reservation_dropoff_time")}</label>
                <select value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} className="w-full border border-zinc-300 px-3 py-3 text-sm">
                  {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="border-t border-zinc-100 pt-6">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-700"><User className="h-4 w-4 text-[#C1272D]" /> {t("reservation_customer")}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder={t("reservation_name")} value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border border-zinc-300 px-4 py-3 text-sm placeholder:text-zinc-400 focus:border-[#C1272D] outline-none" required />
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input placeholder={t("reservation_phone")} value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full border border-zinc-300 pl-10 pr-4 py-3 text-sm placeholder:text-zinc-400 focus:border-[#C1272D] outline-none" required />
              </div>
            </div>
            <div className="mt-4 relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input type="email" placeholder={t("reservation_email")} value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full border border-zinc-300 pl-10 pr-4 py-3 text-sm placeholder:text-zinc-400 focus:border-[#C1272D] outline-none" />
            </div>
          </div>

          {/* ID Upload - NEW */}
          <div className="border-t border-zinc-100 pt-6">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-700"><FileText className="h-4 w-4 text-[#C1272D]" /> {t("reservation_id")} <span className="text-[#C1272D]">*</span></h3>
            <p className="mb-3 text-xs text-zinc-500">{t("reservation_id_hint")}</p>
            <label className="flex cursor-pointer items-center justify-between border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 hover:border-[#C1272D] hover:bg-white transition">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <Upload className="h-5 w-5 text-[#C1272D]" />
                {uploadingId ? (lang === "fr" ? "Envoi..." : "Uploading...") : identityUrl ? (lang === "fr" ? "Remplacer le fichier" : "Replace file") : (lang === "fr" ? "Choisir un fichier" : "Choose file")}
              </span>
              <span className="text-xs text-zinc-400">JPG/PNG/PDF</span>
              <input type="file" accept="image/*,.pdf" onChange={handleIdUpload} className="hidden" />
            </label>
            {identityUrl && (
              <div className="mt-3 flex items-center gap-3 border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                <CheckCircle2 className="h-4 w-4" /> {lang === "fr" ? "Pièce ajoutée" : "ID added"} — <a href={identityUrl} target="_blank" className="underline">voir</a>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t("reservation_notes")}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("reservation_notes_placeholder")} rows={2} className="w-full border border-zinc-300 px-4 py-3 text-sm placeholder:text-zinc-400 focus:border-[#C1272D] outline-none" />
          </div>

          {/* Summary */}
          <div className="border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{t("reservation_summary")}</p>
              <span className="bg-[#0A0A0A] px-2 py-1 text-xs font-bold text-white">{car.pricePerDay} {t("reservation_per_day")}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">{t("reservation_vehicle")}</span><span className="font-bold">{car.brand} {car.model}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">{t("reservation_duration")}</span><span className="font-bold">{booking.days ? `${booking.days} ${lang === "fr" ? "jour(s)" : "day(s)"}` : "—"}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">{lang === "fr" ? "Trajet" : "Route"}</span><span className="text-xs font-medium">{pickupLocation} → {dropoffLocation}</span></div>
              <div className="flex justify-between border-t border-zinc-200 pt-3 text-base"><span className="font-bold">{t("reservation_total")}</span><span className="text-xl font-black">{booking.total ? `${booking.total} DH` : "—"}</span></div>
              <p className="text-[11px] text-zinc-400">✓ {t("reservation_unlimited")} • {lang === "fr" ? "Assurance incluse" : "Insurance included"}</p>
            </div>
          </div>

          <label className="flex gap-3 text-xs leading-5 text-zinc-600">
            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5 accent-[#C1272D]" required />
            {t("reservation_terms")}
          </label>

          {error && <p className="bg-[#C1272D]/10 border border-[#C1272D]/20 px-4 py-3 text-sm text-[#C1272D]">{error}</p>}
          {success && <p className="bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</p>}

          <button type="submit" disabled={loading || !booking.valid || uploadingId} className={`flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-black uppercase tracking-widest transition ${booking.valid && !uploadingId ? "bg-[#C1272D] text-white hover:bg-black" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"}`}>
            {status !== "authenticated" ? t("reservation_login_required") : loading ? (lang === "fr" ? "Vérification..." : "Checking...") : t("reservation_submit")}
          </button>

          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 border border-zinc-300 bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:border-black transition">
            {t("reservation_whatsapp")}
          </a>

          <p className="flex gap-2 text-xs leading-5 text-zinc-400"><Clock className="h-4 w-4 shrink-0 text-[#C1272D]" /> {lang === "fr" ? "Confirmation sous 2h ouvrées. Email à venir (adresse à configurer)." : "Confirmation within 2h. Email coming soon."}</p>
        </div>
      </form>
    </div>
  );
}
