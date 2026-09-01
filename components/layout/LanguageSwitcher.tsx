"use client";

import { useLanguage } from "@/lib/language-context";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 border border-white/15 bg-white/5 px-1 py-1 text-xs font-bold">
      <button onClick={() => setLang("fr")} className={`px-2 py-1 ${lang === "fr" ? "bg-white text-black" : "text-zinc-300 hover:text-white"}`}>FR</button>
      <button onClick={() => setLang("en")} className={`px-2 py-1 ${lang === "en" ? "bg-white text-black" : "text-zinc-300 hover:text-white"}`}>EN</button>
    </div>
  );
}
