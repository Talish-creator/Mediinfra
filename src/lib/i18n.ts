import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ar from "../locales/ar.json";

export type SupportedLanguage = "en" | "ar";

export function getStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("mediinfra_lang");
    if (saved === "en" || saved === "ar") return saved;
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ar")) {
      return "ar";
    }
  } catch {
    // ignore
  }
  return "en";
}

const initialLang = getStoredLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export function applyLanguageToDOM(lang: SupportedLanguage) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  if (lang === "ar") {
    document.documentElement.classList.add("rtl");
  } else {
    document.documentElement.classList.remove("rtl");
  }
}

if (typeof document !== "undefined") {
  applyLanguageToDOM(initialLang);
}

export default i18n;
