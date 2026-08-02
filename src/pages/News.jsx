import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../api/news";
import PageHero from "../components/ui/PageHero";
import Spinner from "../components/ui/Spinner";
import Pagination from "../components/ui/Pagination";
import { formatDate } from "../utils/format";
import { usePublicLang } from "../context/PublicLangContext";

const T = {
  en: { eyebrow: "Newsroom", title: "School News", desc: "Updates, achievements, and stories from across our campuses.", all: "All", empty: "No articles in this category yet." },
  am: { eyebrow: "የዜና ክፍል", title: "የትምህርት ቤት ዜናዎች", desc: "ከግቢዎቻችን ዝማኔዎች፣ ስኬቶች እና ታሪኮች።", all: "ሁሉም", empty: "በዚህ ምድብ ምንም ጽሁፎች የሉም።" },
};

const PAGE_SIZE = 4;

export default function News() {
  const { lang } = usePublicLang();
  const t = T[lang];
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const data = await getNews();
      setNews(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
    })();
  }, []);

  // reset to page 1 when lang changes
  useEffect(() => { setPage(1); }, [lang]);

  const categories = useMemo(() => [t.all, ...Array.from(new Set(news.map((n) => n.category)))], [news, t.all]);
  const filtered = useMemo(() => (category === "All" || category === t.all ? news : news.filter((n) => n.category === category)), [news, category, t.all]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeCategory(cat) { setCategory(cat); setPage(1); }

  return (
    <div>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.desc} />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => changeCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${(category === cat || (cat === t.all && (category === "All" || category === t.all))) ? "bg-plum-800 text-white" : "border border-plum-200 text-ink-950/60 hover:bg-plum-50"}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? <Spinner size="lg" label={lang === "am" ? "ዜናዎችን በመጫን ላይ…" : "Loading news…"} />
          : pageItems.length === 0 ? <p className="mt-12 text-center text-ink-950/50">{t.empty}</p>
          : (
            <div key={`${category}-${page}-${lang}`} className="mt-8 divide-y divide-plum-100">
              {pageItems.map((item, i) => (
                <Link key={item.id} to={`/news/${item.id}`}
                  className="group flex flex-col gap-5 py-7 sm:flex-row animate-fade-in-up"
                  style={{ animationDelay: `${i * 70}ms` }}>
                  <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-plum-100 sm:w-56">
                    <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-ink-950/40">
                      <span className="rounded-full bg-plum-50 px-2.5 py-1 font-semibold uppercase tracking-wide text-plum-700">{item.category}</span>
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <h3 className="mt-2.5 font-display text-xl font-semibold text-plum-900 transition-colors group-hover:text-plum-700">{item.title}</h3>
                    <p className="mt-2 text-sm text-ink-950/55 line-clamp-2">{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        <div className="mt-6"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>
      </section>
    </div>
  );
}
