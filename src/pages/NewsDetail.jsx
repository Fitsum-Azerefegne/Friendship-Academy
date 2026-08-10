import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getNews } from "../api/news";
import Spinner from "../components/ui/Spinner";
import { formatDate } from "../utils/format";
import { usePublicLang } from "../context/PublicLangContext";

export default function NewsDetail() {
  const { id } = useParams();
  const { lang } = usePublicLang();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const backLabel = lang === "am" ? "ወደ ዜናዎች ተመለስ" : "Back to News";
  const notFoundTitle = lang === "am" ? "ጽሁፉ አልተገኘም" : "Article not found";
  const notFoundDesc = lang === "am" ? "ይህ ታሪክ ተንቀሳቅሷል ወይም ተወግዷል።" : "This story may have been moved or removed.";

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getNews();
      const found = data.find((n) => String(n.id) === String(id));
      if (found) setArticle(found);
      else setNotFound(true);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Spinner size="lg" label={lang === "am" ? "ጽሁፍ በመጫን ላይ…" : "Loading article…"} />;

  if (notFound || !article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-plum-50 text-plum-300">
          <span className="font-display text-2xl">?</span>
        </div>
        <p className="mt-5 font-display text-2xl font-semibold text-plum-900">{notFoundTitle}</p>
        <p className="mt-2 text-ink-950/50">{notFoundDesc}</p>
        <Link to="/news" className="mt-6 inline-flex items-center gap-2 rounded-full bg-plum-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-plum-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>
      </div>
    );
  }

  return (
    <article>
      {/* Hero image with gradient */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-plum-100 sm:aspect-[16/8]">
        <img src={article.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-plum-950/20 to-transparent" />
        {/* Back link overlaid on hero */}
        <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
          <Link to="/news"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/25 transition-colors">
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
        </div>
        {/* Category badge on hero */}
        <div className="absolute bottom-5 left-4 sm:left-8">
          <span className="rounded-full bg-brass-500 px-3 py-1 text-xs font-semibold text-ink-950">{article.category}</span>
        </div>
      </div>

      {/* Article body */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-950/50">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(article.date)}</span>
          <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{article.author}</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-plum-900 sm:text-4xl">
          {article.title}
        </h1>

        <p className="mt-4 text-lg text-ink-950/60 leading-relaxed border-l-4 border-plum-200 pl-4 italic">
          {article.excerpt}
        </p>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-950/70">
          {article.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Footer back link */}
        <div className="mt-12 border-t border-plum-100 pt-8">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-plum-700 hover:text-plum-500 transition-colors">
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
