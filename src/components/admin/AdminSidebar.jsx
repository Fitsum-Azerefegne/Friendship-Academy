import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileEdit,
  Newspaper,
  Users,
  Images,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";
import Crest from "../ui/Crest";
import { useAuth } from "../../context/AuthContext";
import { useAdminLang } from "../../context/AdminLangContext";

export default function AdminSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useAdminLang();
  const navigate = useNavigate();

  const links = [
    { to: "/admin/dashboard", label: t.nav.dashboard, icon: LayoutDashboard, end: true },
    { to: "/admin/content", label: t.nav.content, icon: FileEdit },
    { to: "/admin/news", label: t.nav.news, icon: Newspaper },
    { to: "/admin/staff", label: t.nav.staff, icon: Users },
    { to: "/admin/gallery", label: t.nav.gallery, icon: Images },
    { to: "/admin/messages", label: t.nav.messages, icon: Mail },
  ];

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-plum-950 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2.5 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <Crest initial="F" size={34} tone="light" />
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold">{t.brand}</p>
              <p className="text-[11px] text-white/40">{t.brandSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Language toggle */}
        <div className="px-5 pb-3">
          <div
            role="group"
            aria-label="Language"
            className="flex w-fit items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1"
          >
            <button
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                lang === "en" ? "bg-brass-500 text-ink-950" : "text-white/55 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("am")}
              aria-pressed={lang === "am"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                lang === "am" ? "bg-brass-500 text-ink-950" : "text-white/55 hover:text-white"
              }`}
            >
              አማ
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.8} />
            {t.viewWebsite}
          </a>
          <div className="mt-2 flex items-center justify-between rounded-lg px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name || "Admin"}</p>
              <p className="truncate text-xs text-white/40">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" strokeWidth={1.8} />
            {t.logOut}
          </button>
        </div>
      </aside>
    </>
  );
}
