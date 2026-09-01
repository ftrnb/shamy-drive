"use client";

import { useLanguage } from "@/lib/language-context";

export default function ContactForm() {
  const { t } = useLanguage();
  return (
    <form
      className="border border-zinc-200 bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        alert(t("contact_send") + " (demo). Configure Resend pour envoi réel : voir .env.example");
      }}
    >
      <h2 className="text-lg font-black uppercase">{t("contact_form_title")}</h2>
      <p className="mt-2 text-sm text-zinc-500">{t("contact_form_desc")}</p>
      <div className="mt-6 space-y-4">
        <input required placeholder={t("contact_name")} className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D]" />
        <input required type="email" placeholder={t("contact_email")} className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D]" />
        <input placeholder={t("contact_phone")} className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D]" />
        <textarea required rows={5} placeholder={t("contact_message")} className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D]" />
        <button type="submit" className="w-full bg-[#0A0A0A] py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-[#C1272D] transition">
          {t("contact_send")}
        </button>
        <p className="text-xs text-zinc-400">{t("contact_send_hint")}</p>
      </div>
    </form>
  );
}
