import { createContext, useContext, useState } from "react";
import { adminTranslations } from "../data/adminTranslations";

const AdminLangContext = createContext(null);

export function AdminLangProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = adminTranslations[lang];

  return (
    <AdminLangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  const ctx = useContext(AdminLangContext);
  if (!ctx) throw new Error("useAdminLang must be used within an AdminLangProvider");
  return ctx;
}
