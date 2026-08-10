import { useEffect, useState } from "react";
import { CalendarRange, Sparkles } from "lucide-react";
import { mockAcademics } from "../data/mockData";
import SectionHeading from "../components/ui/SectionHeading";
import PageHero from "../components/ui/PageHero";
import Spinner from "../components/ui/Spinner";
import Reveal from "../components/ui/Reveal";
import { formatDate } from "../utils/format";
import { usePublicLang } from "../context/PublicLangContext";

const T = {
  en: {
    eyebrow: "Academics", title: "A curriculum built around depth, not just breadth",
    structureEyebrow: "Structure", gradeLevels: "Grade Levels",
    courseworkEyebrow: "Coursework", subjects: "Subjects Offered",
    programsEyebrow: "Beyond the Classroom", programs: "Special Programs",
    calendarEyebrow: "Plan Ahead", calendar: "Academic Calendar",
  },
  am: {
    eyebrow: "አካዳሚክ", title: "ጥልቀት ላይ የተመሰረተ ስርዓተ ትምህርት",
    structureEyebrow: "አወቃቀር", gradeLevels: "የክፍል ደረጃዎች",
    courseworkEyebrow: "ትምህርቶች", subjects: "የሚሰጡ ትምህርቶች",
    programsEyebrow: "ከክፍል ውጭ", programs: "ልዩ ፕሮግራሞች",
    calendarEyebrow: "አስቀድሞ ያቅዱ", calendar: "የትምህርት ዘመን ቀን መቁጠሪያ",
  },
};

export default function Academics() {
  const { lang } = usePublicLang();
  const t = T[lang];
  const [data, setData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setData(mockAcademics), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return <Spinner size="lg" label={lang === "am" ? "አካዳሚክ በመጫን ላይ…" : "Loading academics…"} />;

  return (
    <div>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={data.overview} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal><SectionHeading eyebrow={t.structureEyebrow} title={t.gradeLevels} /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.gradeLevels.map((g, i) => (
            <Reveal key={g.range} delay={i * 80}>
              <div className="lift-hover relative overflow-hidden rounded-2xl border border-plum-100 bg-white p-6 hover:shadow-md hover:shadow-plum-900/10">
                <span className="absolute right-4 top-3 font-display text-5xl font-bold text-plum-50 select-none">{String(i + 1).padStart(2, "0")}</span>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum-800 text-white mb-4">
                    <span className="text-sm font-bold">{String(i + 1)}</span>
                  </div>
                  <p className="font-display text-lg font-semibold text-plum-900">{g.range}</p>
                  <p className="text-sm text-brass-600 font-medium">{g.grades}</p>
                  <p className="mt-2 text-sm text-ink-950/55 leading-relaxed">{g.focus}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-plum-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal><SectionHeading eyebrow={t.courseworkEyebrow} title={t.subjects} /></Reveal>
          <Reveal delay={100} className="mt-8 flex flex-wrap gap-2.5">
            {data.subjects.map((subj) => (
              <span key={subj} className="rounded-full border border-plum-200 bg-white px-4 py-2 text-sm font-medium text-plum-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-plum-400 hover:shadow-sm">{subj}</span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal><SectionHeading eyebrow={t.programsEyebrow} title={t.programs} /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {data.programs.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div className="lift-hover flex gap-4 rounded-2xl border border-plum-100 bg-white p-6 hover:shadow-md hover:shadow-plum-900/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-plum-50 text-plum-700"><Sparkles className="h-5 w-5" strokeWidth={1.8} /></div>
                <div><p className="font-semibold text-plum-900">{p.name}</p><p className="mt-1 text-sm text-ink-950/55 leading-relaxed">{p.description}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-plum-950">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-2 text-brass-300"><CalendarRange className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">{t.calendarEyebrow}</span></div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white">{t.calendar}</h2>
          </Reveal>
          <Reveal delay={100} className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10">
            {data.calendar.map((term) => (
              <div key={term.term} className="flex flex-col gap-1 p-5 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                <p className="font-medium text-white">{term.term}</p>
                <p className="text-sm text-white/55">{formatDate(term.start)} — {formatDate(term.end)}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
