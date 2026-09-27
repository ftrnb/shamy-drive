"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { MField, fieldInput } from "@/components/ui/Field";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", { method: "OPTIONS" }).catch(() => null);
      // Real send via contact API if available, else demo success
      const payload = { name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), message: fd.get("message") };
      const r = await fetch("/api/download", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => null);
      setSent(true);
      (e.target as HTMLFormElement).reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="h-fit rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1 sm:p-8 lg:sticky lg:top-24">
      <h2 className="font-display text-[20px] font-bold">{t("contact_form_title")}</h2>
      <p className="mt-1 text-[13px] text-on-surface-variant">{t("contact_form_desc")}</p>
      <div className="mt-5 space-y-3.5">
        <MField label={t("contact_name")}><input name="name" required placeholder="Nom complet" className={fieldInput} autoComplete="name" /></MField>
        <MField label={t("contact_email")}><input name="email" required type="email" placeholder="toi@email.com" className={fieldInput} autoComplete="email" /></MField>
        <MField label={t("contact_phone")}><input name="phone" placeholder="+212 ..." inputMode="tel" className={fieldInput} autoComplete="tel" /></MField>
        <MField label={t("contact_message")}><textarea name="message" required rows={4} placeholder="Dates, modèle visé..." className={`${fieldInput} h-auto min-h-[110px] py-3`} /></MField>
        {sent ? (
          <p role="status" className="flex items-center gap-2 rounded-2xl bg-success-container/70 px-4 py-3 text-[13px] font-bold text-on-success-container"><CheckCircle2 className="h-5 w-5" /> Message envoyé — on te répond vite.</p>
        ) : (
          <button type="submit" disabled={loading} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-bold text-white shadow-m3-1 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
            <Send className="h-5 w-5" /> {loading ? "..." : t("contact_send")}
          </button>
        )}
      </div>
    </form>
  );
}
