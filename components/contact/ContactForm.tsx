"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { MField, fieldInput } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Motion";
import { toast } from "@/components/ui/Toaster";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function ContactForm() {
  const { t, lang } = useLanguage();
  const [sent, setSent] = useState<null | { delivered: boolean }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          message: fd.get("message"),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || (lang === "fr" ? "Envoi impossible" : "Send failed"));
      setSent({ delivered: Boolean(data?.delivered) });
      form.reset();
      toast(
        lang === "fr" ? "Message bien reçu" : "Message received",
        { desc: data?.delivered ? (lang === "fr" ? "On te répond par email" : "We'll reply by email") : undefined }
      );
    } catch (err: any) {
      setError(err?.message || (lang === "fr" ? "Envoi impossible — essaie WhatsApp" : "Send failed — try WhatsApp"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Reveal y={24}>
    <form onSubmit={onSubmit} className="h-fit rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1 transition-colors duration-300 sm:p-8 lg:sticky lg:top-24">
      <h2 className="font-display text-[20px] font-bold">{t("contact_form_title")}</h2>
      <p className="mt-1 text-[13px] text-on-surface-variant">{t("contact_form_desc")}</p>
      <div className="mt-5 space-y-3.5">
        <MField label={t("contact_name")}><input name="name" required minLength={2} placeholder="Nom complet" className={fieldInput} autoComplete="name" /></MField>
        <MField label={t("contact_email")}><input name="email" required type="email" placeholder="toi@email.com" className={fieldInput} autoComplete="email" /></MField>
        <MField label={t("contact_phone")}><input name="phone" placeholder="+212 ..." inputMode="tel" className={fieldInput} autoComplete="tel" /></MField>
        <MField label={t("contact_message")}><textarea name="message" required minLength={10} rows={4} placeholder="Dates, modèle visé..." className={`${fieldInput} h-auto min-h-[110px] py-3`} /></MField>
        {error && <p role="alert" className="rounded-2xl bg-error-container/60 px-4 py-3 text-[13px] font-semibold text-error">{error}</p>}
        {sent ? (
          <div role="status" className="space-y-2.5">
            <p className="flex items-center gap-2 rounded-2xl bg-success-container/70 px-4 py-3 text-[13px] font-bold text-on-success-container">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              {sent.delivered
                ? (lang === "fr" ? "Bien reçu — on te répond par email." : "Received — we'll reply by email.")
                : (lang === "fr" ? "Bien noté. Pour une réponse immédiate :" : "Noted. For an instant reply:")}
            </p>
            {!sent.delivered && (
              <a href={`https://wa.me/212661689659?text=${encodeURIComponent(lang === "fr" ? "Bonjour Shamy Drive, je vous ai écrit via le site." : "Hello Shamy Drive, I wrote via the website.")}`} target="_blank" rel="noopener" className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-success px-6 text-[15px] font-bold text-white transition hover:brightness-110 active:scale-[0.98]">
                <MessageCircle className="h-5 w-5" /> WhatsApp direct
              </a>
            )}
          </div>
        ) : (
          <button type="submit" disabled={loading} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-bold text-white shadow-m3-1 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
            {loading ? <Spinner /> : <Send className="h-5 w-5" />}
            {loading ? (lang === "fr" ? "Envoi..." : "Sending...") : t("contact_send")}
          </button>
        )}
      </div>
    </form>
    </Reveal>
  );
}
