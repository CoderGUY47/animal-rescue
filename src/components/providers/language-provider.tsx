"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '@/lib/translations';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("English");

  useEffect(() => {
    const savedLang = localStorage.getItem("app-language") || "English";
    setLanguageState(savedLang);
    
    // Sync language updates on custom event
    const handleLangChange = () => {
      const updatedLang = localStorage.getItem("app-language") || "English";
      setLanguageState(updatedLang);
    };

    window.addEventListener("language-change", handleLangChange);
    return () => {
      window.removeEventListener("language-change", handleLangChange);
    };
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
    window.dispatchEvent(new Event("language-change"));
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.English;
    return langDict[key] || TRANSLATIONS.English[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "English",
      setLanguage: () => {},
      t: (key: string) => key
    };
  }
  return context;
}
