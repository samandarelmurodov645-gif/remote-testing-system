"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { type Lang, getT } from "@/lib/i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  isChanging: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "uz",
  setLang: () => {},
  t: (key) => key,
  isChanging: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
    // Refresh server components so they re-render with the new language cookie
    startTransition(() => {
      router.refresh();
    });
  }

  const t = getT(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isChanging: isPending }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
