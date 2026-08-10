import { useEffect, useState } from "react";
import { Mail, Target, Eye, Flag } from "lucide-react";
import { getContent } from "../api/content";
import { getStaff } from "../api/staff";
import SectionHeading from "../components/ui/SectionHeading";
import Spinner from "../components/ui/Spinner";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import { usePublicLang } from "../context/PublicLangContext";

const labels = {
  en: {
    hero: "About Us",
    heroTitle: "Nearly five decades of paying close attention",
    story: "Our Story",
    history: "School History",
    mission: "Mission",
    vision: "Vision",
    goal: "Goal",
    values: "Our Values",
    leadership: "From Our Leadership",
    principalMsg: "Principal's Message",
    ourPeople: "Our People",
    faculty: "Leadership & Faculty",
    facultyDesc: "A glimpse of the educators guiding our students day to day.",
    email: "Email",
  },
  am: {
    hero: "ስለ እኛ",
    heroTitle: "ፍሬንድሺፕ አካዳሚ — የትውልድ ማነፀያ ማዕከል",
    story: "ታሪካችን",
    history: "የትምህርት ቤቱ ታሪክ",
    mission: "ተልዕኮ",
    vision: "ራዕይ",
    goal: "ግብ",
    values: "የተቋማችን እሴቶች",
    leadership: "ከአመራራችን",
    principalMsg: "የርዕሰ መምህሩ መልዕክት",
    ourPeople: "ሰዎቻችን",
    faculty: "አመራር እና መምህራን",
    facultyDesc: "ተማሪዎቻችንን በየቀኑ የሚመሩ አስተማሪዎች።",
    email: "ኢሜይል",
  },
};

export default function About() {
  const [content, setContent] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = usePublicLang();
  const l = labels[lang];

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([getContent(), getStaff()]);
      setContent(c);
      setStaff(s.slice(0, 8));
      setLoading(false);
    })();
  }, []);

  if (loading || !content) return <Spinner size="lg" label="Loading About page…" />;

  const mission = lang === "am" ? (content.missionAm || content.mission) : content.mission;
  const vision  = lang === "am" ? (content.visionAm  || content.vision)  : content.vision;
  const goal    = lang === "am" ? (content.goalAm    || content.goal)    : content.goal;
  const history = lang === "am" ? (content.historyAm || content.history) : content.history;
  const values  = lang === "am" ? (content.valuesAm  || content.values)  : content.values;

  return (
    <div>
      <PageHero eyebrow={l.hero} title={l.heroTitle} />

      {/* History */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow={l.story} title={l.history} />
          <p className="mt-6 text-base leading-relaxed text-ink-950/70">{history}</p>
        </Reveal>
      </section>

      {/* Mission, Vision, Goal */}
      <section className="bg-plum-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Reveal className="lift-hover rounded-2xl bg-white p-6 sm:p-8 shadow-sm shadow-plum-900/5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-brass-600" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-600">{l.mission}</span>
              </div>
              <p className="font-display text-base leading-snug text-plum-900">{mission}</p>
            </Reveal>
            <Reveal delay={100} className="lift-hover rounded-2xl bg-plum-950 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-brass-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-300">{l.vision}</span>
              </div>
              <p className="font-display text-base leading-snug text-white">{vision}</p>
            </Reveal>
            <Reveal delay={200} className="lift-hover rounded-2xl bg-plum-800 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Flag className="h-4 w-4 text-brass-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-300">{l.goal}</span>
              </div>
              <p className="font-display text-base leading-snug text-white">{goal}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      {values?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow={l.values} title={l.values} />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="lift-hover flex gap-3 rounded-2xl border border-plum-100 bg-white p-5 hover:shadow-md hover:shadow-plum-900/10">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-plum-950 text-[11px] font-bold text-white">{i + 1}</span>
                  <p className="text-sm text-ink-950/70 leading-relaxed">{v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Principal's Message */}
      <section className="bg-plum-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow={l.leadership} title={l.principalMsg} align="center" />
          </Reveal>
          <Reveal delay={100} className="mt-10 grid grid-cols-1 items-center gap-8 sm:gap-10 rounded-2xl border border-plum-100 bg-white p-6 shadow-sm shadow-plum-900/5 sm:p-10 md:grid-cols-[200px_1fr]">
            <img
              src={content.principal.photo}
              alt={content.principal.name}
              className="mx-auto h-48 w-48 rounded-2xl object-cover md:h-full md:w-full"
            />
            <div>
              <p className="font-display text-xl leading-relaxed text-plum-900 italic">
                "{lang === "am" ? (content.principal.messageAm || content.principal.message) : content.principal.message}"
              </p>
              <p className="mt-6 font-semibold text-ink-950">
                {lang === "am" ? (content.principal.nameAm || content.principal.name) : content.principal.name}
              </p>
              <p className="text-sm text-ink-950/50">
                {lang === "am" ? (content.principal.titleAm || content.principal.title) : content.principal.title}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Staff Directory */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow={l.ourPeople} title={l.faculty} description={l.facultyDesc} />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {staff.map((member, i) => (
            <Reveal key={member.id} delay={(i % 4) * 70}>
              <div className="lift-hover rounded-2xl bg-white p-4 text-center shadow-sm shadow-plum-900/5 hover:shadow-md hover:shadow-plum-900/10 border border-plum-100">
                <img src={member.photo} alt={member.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
                <p className="mt-3 text-sm font-semibold text-plum-900">{member.name}</p>
                <p className="text-xs text-ink-950/50">{member.title}</p>
                <a href={`mailto:${member.email}`} className="mt-2 inline-flex items-center gap-1 text-[11px] text-plum-700 transition-colors hover:text-plum-500">
                  <Mail className="h-3 w-3" /> {l.email}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
