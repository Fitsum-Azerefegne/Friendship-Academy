import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { getContent } from "../api/content";
import { getStaff } from "../api/staff";
import SectionHeading from "../components/ui/SectionHeading";
import Spinner from "../components/ui/Spinner";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";

export default function About() {
  const [content, setContent] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([getContent(), getStaff()]);
      setContent(c);
      setStaff(s.slice(0, 8));
      setLoading(false);
    })();
  }, []);

  if (loading || !content) return <Spinner size="lg" label="Loading About page…" />;

  return (
    <div>
      <PageHero eyebrow="About Us" title="Nearly five decades of paying close attention" />

      {/* History */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Our Story" title="School History" />
          <p className="mt-6 text-base leading-relaxed text-ink-950/70">{content.history}</p>
        </Reveal>
      </section>

      {/* Mission & Vision */}
      <section className="bg-plum-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Reveal className="lift-hover rounded-2xl bg-white p-6 sm:p-8 shadow-sm shadow-plum-900/5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-600">Mission</span>
              <p className="mt-4 font-display text-xl leading-snug text-plum-900">{content.mission}</p>
            </Reveal>
            <Reveal delay={120} className="lift-hover rounded-2xl bg-plum-950 p-6 sm:p-8">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-300">Vision</span>
              <p className="mt-4 font-display text-xl leading-snug text-white">{content.vision}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="From Our Leadership" title="Principal's Message" align="center" />
        </Reveal>
        <Reveal delay={100} className="mt-10 grid grid-cols-1 items-center gap-8 sm:gap-10 rounded-2xl border border-plum-100 bg-white p-6 shadow-sm shadow-plum-900/5 sm:p-10 md:grid-cols-[280px_1fr]">
          <img
            src={content.principal.photo}
            alt={content.principal.name}
            className="mx-auto h-56 w-56 rounded-2xl object-cover md:h-full md:w-full"
          />
          <div>
            <p className="font-display text-xl leading-relaxed text-plum-900 italic">
              "{content.principal.message}"
            </p>
            <p className="mt-6 font-semibold text-ink-950">{content.principal.name}</p>
            <p className="text-sm text-ink-950/50">{content.principal.title}</p>
          </div>
        </Reveal>
      </section>

      {/* Staff Directory */}
      <section className="bg-plum-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Our People" title="Leadership & Faculty" description="A glimpse of the educators guiding our students day to day." />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {staff.map((member, i) => (
              <Reveal key={member.id} delay={(i % 4) * 70}>
                <div className="lift-hover rounded-2xl bg-white p-4 text-center shadow-sm shadow-plum-900/5 hover:shadow-md hover:shadow-plum-900/10">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                  <p className="mt-3 text-sm font-semibold text-plum-900">{member.name}</p>
                  <p className="text-xs text-ink-950/50">{member.title}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-plum-700 transition-colors hover:text-plum-500"
                  >
                    <Mail className="h-3 w-3" /> Email
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
