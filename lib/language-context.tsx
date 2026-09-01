"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lang, translations } from "./translations";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof translations.fr) => string };
const LanguageContext = createContext<Ctx>({ lang: "fr", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    const saved = localStorage.getItem("shamy-lang") as Lang | null;
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("shamy-lang", l);
    document.documentElement.lang = l;
  };
  const t = (k: keyof typeof translations.fr) => (translations[lang] as any)[k] || k;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
