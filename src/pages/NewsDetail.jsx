import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getNews } from "../api/news";
import Spinner from "../components/ui/Spinner";
import { formatDate } from "../utils/format";

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  if (loading) return <Spinner size="lg" label="Loading article…" />;

  if (notFound || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="font-display text-2xl font-semibold text-plum-900">Article not found</p>
        <p className="mt-2 text-ink-950/50">This story may have been moved or removed.</p>
        <Link to="/news" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-plum-700">
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <article>
      <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden bg-plum-100">
        <img src={article.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-plum-700 hover:text-plum-500">
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>
        <div className="mt-6 flex items-center gap-3 text-xs text-ink-950/40">
          <span className="rounded-full bg-plum-50 px-2.5 py-1 font-semibold uppercase tracking-wide text-plum-700">
            {article.category}
          </span>
          <span>{formatDate(article.date)}</span>
          <span>· By {article.author}</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-plum-900 sm:text-4xl">
          {article.title}
        </h1>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-950/70">
          {article.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
