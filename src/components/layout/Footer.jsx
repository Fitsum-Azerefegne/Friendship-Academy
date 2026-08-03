import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { mockContent } from "../../data/mockData";
import { usePublicLang } from "../../context/PublicLangContext";

const quickLinksData = {
  en: [
    { to: "/about", label: "About Us" },
    { to: "/academics", label: "Academics" },
    { to: "/news", label: "News" },
    { to: "/gallery", label: "Gallery" },
    { to: "/staff", label: "Staff Directory" },
  ],
  am: [
    { to: "/about", label: "ስለ እኛ" },
    { to: "/academics", label: "አካዳሚክ" },
    { to: "/news", label: "ዜናዎች" },
    { to: "/gallery", label: "ማዕከለ-ስዕላት" },
    { to: "/staff", label: "የሰራተኞች ማውጫ" },
  ],
};

const footerText = {
  en: { quickLinks: "Quick Links", contact: "Contact", officeHours: "Office Hours", hours: ["Monday – Friday: 7:30 AM – 4:30 PM", "Saturday: 9:00 AM – 12:00 PM", "Sunday: Closed"], built: "Built with care for our kindergarten community." },
  am: { quickLinks: "ፈጣን አገናኞች", contact: "አድራሻ", officeHours: "የቢሮ ሰዓታት", hours: ["ሰኞ – አርብ: 7:30 ጠ.ቀ – 4:30 ከ.ቀ", "ቅዳሜ: 9:00 ጠ.ቀ – 12:00 ቀ", "እሁድ: ዝግ"], built: "ለህፃናት ትምህርት ቤታችን ማህበረሰብ በፍቅር ተሰርቷል።" },
};

export default function Footer() {
  const { lang } = usePublicLang();
  const quickLinks = quickLinksData[lang];
  const ft = footerText[lang];
  return (
    <footer className="bg-plum-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/Logo.png" alt="Friendship Academy logo" className="h-9 w-9 rounded-full object-cover" />
              <p className="font-display text-lg font-semibold">
                {lang === "am" ? "ፍሬንድሺፕ አካዳሚ" : "Friendship Academy"}
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-xs">
              {lang === "am"
                ? "የማወቅ ጉጉት ባህሪ የሚሆንበት — ከ1979 ጀምሮ ጉጉ፣ ሥነ ምግባር ያላቸው ህፃናትን ማስተማር።"
                : "Where Curiosity Becomes Character — nurturing curious, principled children since 1979."}
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://t.me/friendship_academy"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-300">{ft.quickLinks}</p>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-300">{ft.contact}</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brass-300" />
                <span>{mockContent.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-brass-300" />
                <span>{mockContent.phone}</span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-brass-300" />
                <span>{mockContent.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-300">{ft.officeHours}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {ft.hours.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/20 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © 2026 Friendship Academy. All rights reserved.
          </p>
          <p className="text-xs text-white/50">{ft.built}</p>
        </div>
      </div>
    </footer>
  );
}
