import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, GraduationCap, CalendarClock, ArrowRight, ArrowUpRight,
  BookOpen, Image as ImageIcon, Newspaper, MapPin,
} from "lucide-react";
import { getContent } from "../api/content";
import { getNews } from "../api/news";
import { mockGallery } from "../data/mockData";
import { homeTranslations } from "../data/homeTranslations";

const galleryPreviewImages = mockGallery.slice(0, 4);
import StatCard from "../components/ui/StatCard";
import SectionHeading from "../components/ui/SectionHeading";
import Spinner from "../components/ui/Spinner";
import Reveal from "../components/ui/Reveal";
import { formatDate } from "../utils/format";
import { usePublicLang } from "../context/PublicLangContext";

const quickLinkIcons = [Newspaper, BookOpen, ImageIcon, MapPin];

export default function Home() {
  const [content, setContent] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = usePublicLang();

  useEffect(() => {
    (async () => {
      const [c, n] = await Promise.all([getContent(), getNews()]);
      setContent(c);
      setNews(n.slice(0, 3));
      setLoading(false);
    })();
  }, []);

  if (loading || !content) {
    return <Spinner size="lg" label="Loading the homepage…" />;
  }

  const t = homeTranslations[lang];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-plum-950">
        <img src={content.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950 via-plum-950/60 to-plum-950/20" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-plum-700/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute top-1/2 -left-32 h-72 w-72 rounded-full bg-brass-500/10 blur-3xl animate-float-mid" style={{ animationDelay: "2s" }} />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-plum-600/15 blur-2xl animate-float-slow" style={{ animationDelay: "3.5s" }} />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8">
          <div className="flex flex-col gap-12">
            {/* Left: text content */}
            <div className="flex-1">
              <div key={lang} className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-300">
                  {t.established}
                </span>
              </div>
              <h1
                key={`title-${lang}`}
                className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl animate-fade-in-up"
                style={{ animationDelay: "80ms" }}
              >
                {lang === "am" ? (content.schoolNameAm || t.schoolNameDisplay) : t.schoolNameDisplay}
              </h1>
              <p
                key={`tagline-${lang}`}
                className="mt-5 max-w-xl text-lg text-white/70 animate-fade-in-up"
                style={{ animationDelay: "160ms" }}
              >
                {lang === "am" ? (content.taglineAm || t.tagline) : t.tagline}
              </p>
              <div
                key={`buttons-${lang}`}
                className="mt-9 flex flex-wrap gap-3 animate-fade-in-up"
                style={{ animationDelay: "240ms" }}
              >
                <Link
                  to="/contact"
                  className="lift-hover inline-flex items-center gap-2 rounded-full bg-brass-500 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-brass-400 hover:shadow-lg hover:shadow-brass-500/20 transition-colors"
                >
                  {t.applyButton} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="lift-hover inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {t.aboutButton}
                </Link>
              </div>
              <div
                key={`stats-${lang}`}
                className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:max-w-xl animate-fade-in-up"
                style={{ animationDelay: "320ms" }}
              >
                <StatCard icon={Users} value={content.stats.students.toLocaleString()} label={t.statsStudents} tone="dark" />
                <StatCard icon={GraduationCap} value={content.stats.teachers} label={t.statsTeachers} tone="dark" />
                <StatCard icon={CalendarClock} value={`${content.stats.yearsOpen} ${t.yearsSuffix}`} label={t.statsEducating} tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="mx-auto max-w-7xl px-4 -mt-8 relative sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-ink-950/10 sm:grid-cols-4 sm:gap-4 sm:p-4">
          {t.quickLinks.map(({ to, label, description }, i) => {
            const Icon = quickLinkIcons[i];
            return (
              <Link
                key={to}
                to={to}
                className="lift-hover group flex flex-col gap-2.5 rounded-xl p-4 hover:bg-plum-50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-plum-50 text-plum-700 transition-colors group-hover:bg-plum-100">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-plum-900">{label}</p>
                  <p className="text-xs text-ink-950/45 mt-0.5">{description}</p>
                </div>
              </Link>
            );
          })}
        </Reveal>
      </section>

      {/* Latest News */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow={t.newsEyebrow} title={t.newsTitle} description={t.newsDescription} />
          <Link to="/news" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-plum-800 transition-colors hover:text-plum-600">
            {t.viewAllNews} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {news.map((item, i) => {
            const translated = t.news[item.id];
            return (
              <Reveal key={item.id} delay={i * 90}>
                <Link
                  to={`/news/${item.id}`}
                  className="lift-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-plum-100 bg-white shadow-sm shadow-plum-900/5 hover:shadow-lg hover:shadow-plum-900/10"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-plum-100">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <span className="w-fit rounded-full bg-plum-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-plum-700">
                      {translated?.category ?? item.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-plum-900 leading-snug line-clamp-2">
                      {translated?.title ?? item.title}
                    </h3>
                    <p className="text-sm text-ink-950/55 line-clamp-2">{translated?.excerpt ?? item.excerpt}</p>
                    <p className="mt-auto pt-2 text-xs text-ink-950/40">{formatDate(item.date)}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Gallery preview + CTA */}
      <section className="bg-plum-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            {/* Photo strip */}
            <Reveal className="lg:col-span-3">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                <SectionHeading eyebrow={t.galleryEyebrow} title={t.galleryTitle} />
                <Link
                  to="/gallery"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-plum-800 hover:text-plum-600 transition-colors"
                >
                  {t.viewGallery} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {galleryPreviewImages.map((img, i) => (
                  <Reveal key={img.id} delay={i * 70}>
                    <Link
                      to="/gallery"
                      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-plum-100"
                    >
                      <img
                        src={img.image}
                        alt={img.caption}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-plum-950/0 transition-colors duration-300 group-hover:bg-plum-950/30 rounded-2xl" />
                      <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xs font-medium text-white drop-shadow">{img.caption}</span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            {/* CTA card */}
            <Reveal delay={150} className="lg:col-span-2 flex flex-col justify-center rounded-2xl bg-plum-950 p-6 sm:p-8 text-white">
              <h3 className="font-display text-2xl font-semibold">{t.ctaTitle}</h3>
              <p className="mt-3 text-sm text-white/60">{t.ctaDescription}</p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  to="/contact"
                  className="lift-hover inline-flex items-center justify-center gap-2 rounded-full bg-brass-500 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-brass-400 transition-colors"
                >
                  {t.ctaApply}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
