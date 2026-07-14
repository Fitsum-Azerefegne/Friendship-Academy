import { createContext, useContext, useEffect, useState } from "react";

const PublicLangContext = createContext(null);
const STORAGE_KEY = "friendship-public-lang";

export function PublicLangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "am" ? "am" : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  return (
    <PublicLangContext.Provider value={{ lang, setLang }}>
      {children}
    </PublicLangContext.Provider>
  );
}

export function usePublicLang() {
  const ctx = useContext(PublicLangContext);
  if (!ctx) throw new Error("usePublicLang must be used within a PublicLangProvider");
  return ctx;
}
