import React, { createContext, useContext, useMemo, useState } from "react";

const I18nContext = createContext(null);

const DICT = {
  en: {
    dashboard: "Dashboard",
    startInterview: "Start Interview",
    ats: "ATS",
    history: "History",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    startInterview: "इंटरव्यू शुरू करें",
    ats: "ATS",
    history: "इतिहास",
    settings: "सेटिंग्स",
    profile: "प्रोफ़ाइल",
    logout: "लॉगआउट"
  }
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  const value = useMemo(() => {
    const dict = DICT[lang] || DICT.en;
    return {
      lang,
      setLang(next) {
        localStorage.setItem("lang", next);
        setLang(next);
      },
      t(key) {
        return dict[key] || DICT.en[key] || key;
      }
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
