"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { type Lang, getT, translations } from "@/lib/i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "uz",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  useEffect(() => {
    const stored =
      localStorage.getItem("lang") ||
      document.cookie
        .split("; ")
        .find((r) => r.startsWith("lang="))
        ?.split("=")[1];
    if (stored && ["uz", "en", "ru", "fr"].includes(stored)) {
      setLangState(stored as Lang);
    }
  }, []);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=lax`;
  }

  const t = getT(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
