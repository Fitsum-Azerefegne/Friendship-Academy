import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import { usePublicLang } from "../../context/PublicLangContext";

const schoolName = { en: "Friendship Academy", am: "ፍሬንድሺፕ አካዳሚ" };
const estText    = { en: "Est. 1979",           am: "ከ 1979 ጀምሮ" };

const links = [
  { to: "/",          label: { en: "Home",      am: "መነሻ" },      end: true },
  { to: "/about",     label: { en: "About",     am: "ስለ እኛ" } },
  { to: "/academics", label: { en: "Academics", am: "ትምህርት" } },
  { to: "/news",      label: { en: "News",      am: "ዜና" } },
  { to: "/gallery",   label: { en: "Gallery",   am: "ምስሎች" } },
  { to: "/staff",     label: { en: "Staff",     am: "ሰራተኞች" } },
  { to: "/contact",   label: { en: "Contact",   am: "አግኙን" } },
];

const uiText = {
  en: { admin: "Admin", adminLogin: "Admin Login", contactUs: "Contact Us", language: "Language" },
  am: { admin: "አስተዳዳሪ", adminLogin: "የአስተዳዳሪ መግቢያ", contactUs: "አግኙን", language: "ቋንቋ" },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { lang, setLang } = usePublicLang();
  const t = uiText[lang];

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const langToggle = (
    <div role="group" aria-label={t.language} className="flex items-center gap-1 rounded-full border border-plum-200 bg-plum-50/60 p-1">
      <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${lang === "en" ? "bg-plum-700 text-white" : "text-plum-800 hover:bg-plum-100"}`}>
        EN
      </button>
      <button type="button" onClick={() => setLang("am")} aria-pressed={lang === "am"}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${lang === "am" ? "bg-plum-700 text-white" : "text-plum-800 hover:bg-plum-100"}`}>
        አማ
      </button>
    </div>
  );

  return (
    <header className={`sticky top-0 z-40 transition-colors ${scrolled ? "bg-white/95 backdrop-blur shadow-sm shadow-plum-900/5" : "bg-white"} border-b border-plum-100`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo + name */}
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5 shrink-0">
          <img src="/Logo.png" alt="Friendship Academy logo" className="h-10 w-10 rounded-full object-cover" />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm sm:text-base font-semibold text-plum-900 max-w-[170px] sm:max-w-none">
              {schoolName[lang]}
            </p>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-brass-600">
              {estText[lang]}
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? "bg-plum-50 text-plum-800" : "text-ink-950/65 hover:bg-plum-50 hover:text-plum-800"}`}>
              {l.label[lang]}
            </NavLink>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {langToggle}
          <Link to="/admin" className="lift-hover inline-flex items-center gap-1.5 rounded-full border border-plum-200 px-3.5 py-2 text-sm font-medium text-plum-800 hover:bg-plum-50 transition-colors">
            <ShieldCheck className="h-4 w-4" /> {t.admin}
          </Link>
          <Link to="/contact" className="lift-hover rounded-full bg-plum-800 px-4 py-2 text-sm font-semibold text-white hover:bg-plum-700 hover:shadow-lg hover:shadow-plum-900/20 transition-colors">
            {t.contactUs}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="shrink-0 rounded-lg p-2 text-plum-800 lg:hidden" onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="animate-slide-down border-t border-plum-100 bg-white px-4 pb-4 pt-2 lg:hidden">
          <div className="mb-3">{langToggle}</div>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-plum-50 text-plum-800" : "text-ink-950/70"}`}>
                {l.label[lang]}
              </NavLink>
            ))}
            <Link to="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium text-plum-800">{t.adminLogin}</Link>
            <Link to="/contact" className="mt-2 rounded-full bg-plum-800 px-4 py-2.5 text-center text-sm font-semibold text-white">{t.contactUs}</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
