import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Users, Images, Mail, ArrowUpRight } from "lucide-react";
import { getNews } from "../../api/news";
import { getStaff } from "../../api/staff";
import { getGallery } from "../../api/gallery";
import { getMessages } from "../../api/messages";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { useAdminLang } from "../../context/AdminLangContext";
import { formatDate } from "../../utils/format";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useAdminLang();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ news: 0, staff: 0, gallery: 0, messages: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentNews, setRecentNews] = useState([]);

  useEffect(() => {
    (async () => {
      const [news, staff, gallery, messages] = await Promise.all([
        getNews(), getStaff(), getGallery(), getMessages(),
      ]);
      setCounts({
        news: news.length,
        staff: staff.length,
        gallery: gallery.length,
        messages: messages.filter((m) => !m.read).length,
      });
      setRecentMessages(messages.slice(0, 4));
      setRecentNews(news.slice(0, 4));
      setLoading(false);
    })();
  }, []);

  if (loading) return <Spinner size="lg" label="Loading dashboard…" />;

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-plum-900">
          {t.welcomeBack}, {user?.name?.split(" ")[0] || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-ink-950/50">{t.dashboardSubtitle}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Newspaper, value: counts.news, label: t.statNews },
          { icon: Users, value: counts.staff, label: t.statStaff },
          { icon: Images, value: counts.gallery, label: t.statGallery },
          { icon: Mail, value: counts.messages, label: t.statMessages },
        ].map((s, i) => (
          <div key={s.label} className="lift-hover animate-fade-in-up" style={{ animationDelay: `${i * 70}ms` }}>
            <StatCard icon={s.icon} value={s.value} label={s.label} />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up rounded-2xl border border-plum-100 bg-white p-6" style={{ animationDelay: "280ms" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-plum-900">{t.recentNews}</h2>
            <Link to="/admin/news" className="inline-flex items-center gap-1 text-xs font-semibold text-plum-700 transition-colors hover:text-plum-500">
              {t.manage} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-plum-100">
            {recentNews.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-plum-50/60">
                <p className="truncate text-sm text-ink-950/70">{n.title}</p>
                <span className="shrink-0 text-xs text-ink-950/35">{formatDate(n.date)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-in-up rounded-2xl border border-plum-100 bg-white p-6" style={{ animationDelay: "350ms" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-plum-900">{t.recentMessages}</h2>
            <Link to="/admin/messages" className="inline-flex items-center gap-1 text-xs font-semibold text-plum-700 transition-colors hover:text-plum-500">
              {t.viewAll} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-plum-100">
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-plum-50/60">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-950/70">{m.subject}</p>
                  <p className="truncate text-xs text-ink-950/35">{m.name}</p>
                </div>
                {!m.read && <span className="shrink-0 h-2 w-2 rounded-full bg-brass-500" aria-label="Unread" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
