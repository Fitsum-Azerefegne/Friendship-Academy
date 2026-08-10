import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getNews } from "../api/news";
import PageHero from "../components/ui/PageHero";
import Spinner from "../components/ui/Spinner";
import Pagination from "../components/ui/Pagination";
import Reveal from "../components/ui/Reveal";
import { formatDate } from "../utils/format";
import { usePublicLang } from "../context/PublicLangContext";

const T = {
  en: { eyebrow: "Newsroom", title: "School News", desc: "Updates, achievements, and stories from across our campuses.", all: "All", empty: "No articles in this category yet.", featured: "Latest Story" },
  am: { eyebrow: "የዜና ክፍል", title: "የትምህርት ቤት ዜናዎች", desc: "ከግቢዎቻችን ዝማኔዎች፣ ስኬቶች እና ታሪኮች።", all: "ሁሉም", empty: "በዚህ ምድብ ምንም ጽሁፎች የሉም።", featured: "የቅርብ ጊዜ ዜና" },
};

const PAGE_SIZE = 6;

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

  useEffect(() => { setPage(1); }, [lang]);

  const categories = useMemo(() => [t.all, ...Array.from(new Set(news.map((n) => n.category)))], [news, t.all]);
  const filtered = useMemo(() => (category === "All" || category === t.all ? news : news.filter((n) => n.category === category)), [news, category, t.all]);

  // Split featured (first) from the rest
  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const pageItems = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeCategory(cat) { setCategory(cat); setPage(1); }

  return (
    <div>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.desc} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => changeCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${(category === cat || (cat === t.all && (category === "All" || category === t.all))) ? "bg-plum-800 text-white" : "border border-plum-200 text-ink-950/60 hover:bg-plum-50"}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? <Spinner size="lg" label={lang === "am" ? "ዜናዎችን በመጫን ላይ…" : "Loading news…"} />
          : filtered.length === 0 ? <p className="mt-12 text-center text-ink-950/50">{t.empty}</p>
          : (
            <div key={`${category}-${page}-${lang}`}>
              {/* Featured article */}
              {featured && (
                <Reveal className="mt-8">
                  <Link to={`/news/${featured.id}`}
                    className="lift-hover group relative flex flex-col overflow-hidden rounded-3xl bg-plum-950 shadow-xl shadow-plum-900/20 sm:flex-row sm:h-72">
                    <div className="absolute inset-0">
                      <img src={featured.image} alt="" className="h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-r from-plum-950/95 via-plum-950/70 to-transparent" />
                    </div>
                    <div className="relative flex flex-col justify-end p-6 sm:p-8 sm:max-w-lg">
                      <span className="w-fit rounded-full bg-brass-500 px-3 py-1 text-[11px] font-semibold text-ink-950">{featured.category}</span>
                      <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-white sm:text-3xl group-hover:text-brass-300 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/60 line-clamp-2">{featured.excerpt}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                        <span>{formatDate(featured.date)}</span>
                        <span>·</span>
                        <span>{featured.author}</span>
                      </div>
                    </div>
                    <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      {t.featured} <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Card grid */}
              {pageItems.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pageItems.map((item, i) => (
                    <Reveal key={item.id} delay={i * 60}>
                      <Link to={`/news/${item.id}`}
                        className="lift-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-plum-100 bg-white shadow-sm hover:shadow-lg hover:shadow-plum-900/10">
                        <div className="aspect-[16/10] overflow-hidden bg-plum-100">
                          <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-5">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-plum-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-plum-700">{item.category}</span>
                            <span className="text-xs text-ink-950/35">{formatDate(item.date)}</span>
                          </div>
                          <h3 className="font-display text-base font-semibold text-plum-900 leading-snug line-clamp-2 group-hover:text-plum-700 transition-colors">{item.title}</h3>
                          <p className="text-sm text-ink-950/55 line-clamp-2 flex-1">{item.excerpt}</p>
                          <p className="mt-1 text-xs text-ink-950/35">{item.author}</p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}

              <div className="mt-8"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>
            </div>
          )}
      </section>
    </div>
  );
}
