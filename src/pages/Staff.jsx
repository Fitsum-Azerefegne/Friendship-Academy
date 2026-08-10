import { useEffect, useMemo, useState } from "react";
import { Search, Mail, Phone, GraduationCap, Users } from "lucide-react";
import { getStaff } from "../api/staff";
import PageHero from "../components/ui/PageHero";
import Spinner from "../components/ui/Spinner";
import Reveal from "../components/ui/Reveal";
import { usePublicLang } from "../context/PublicLangContext";

const T = {
  en: {
    eyebrow: "Our People", title: "Meet Our Teachers", desc: "Dedicated educators shaping the next generation — find and connect with our faculty.",
    searchPh: "Search by name or subject…", all: "All", empty: "No staff members match your search.", loading: "Loading staff directory…",
    grade: "Grade", email: "Email", phone: "Phone",
  },
  am: {
    eyebrow: "ሰዎቻችን", title: "መምህራኖቻችንን ያግኙ", desc: "ቀጣዩን ትውልድ የሚቀርጹ ቁርጠኛ አስተማሪዎች — የትምህርት ቤቱን ሰራተኞች ያግኙ።",
    searchPh: "በስም ወይም ትምህርት ይፈልጉ…", all: "ሁሉም", empty: "ከፍለጋዎ ጋር የሚዛመድ ሰራተኛ አልተገኘም።", loading: "የሰራተኞች ማውጫ በመጫን ላይ…",
    grade: "ክፍል", email: "ኢሜይል", phone: "ስልክ",
  },
};

// Distinct gradient per card index — cycles through 6 combos
const gradients = [
  "from-plum-900 to-plum-700",
  "from-plum-800 to-plum-600",
  "from-violet-900 to-plum-700",
  "from-plum-700 to-purple-600",
  "from-indigo-800 to-plum-700",
  "from-plum-900 to-violet-700",
];

export default function Staff() {
  const { lang } = usePublicLang();
  const t = T[lang];
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");

  useEffect(() => {
    (async () => { const data = await getStaff(); setStaff(data); setLoading(false); })();
  }, []);

  const departments = useMemo(() => [t.all, ...Array.from(new Set(staff.map((s) => s.department).filter(Boolean)))], [staff, t.all]);

  const filtered = useMemo(() => staff.filter((s) => {
    const matchesDept = department === "All" || department === t.all || s.department === department;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || s.name.toLowerCase().includes(q) || (s.title || "").toLowerCase().includes(q) || (s.grade || "").toLowerCase().includes(q);
    return matchesDept && matchesQuery;
  }), [staff, department, query, t.all]);

  return (
    <div>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.desc} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-950/35" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh}
              className="w-full rounded-full border border-plum-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-950/35 focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100" />
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <button key={d} onClick={() => setDepartment(d)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${department === d ? "bg-plum-800 text-white" : "border border-plum-200 text-ink-950/60 hover:bg-plum-50"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        {!loading && filtered.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-sm text-ink-950/50">
            <Users className="h-4 w-4" />
            <span>{filtered.length} {lang === "am" ? "ሰራተኞች" : "staff members"}</span>
          </div>
        )}

        {loading ? <Spinner size="lg" label={t.loading} />
          : filtered.length === 0 ? <p className="mt-12 text-center text-ink-950/50">{t.empty}</p>
          : (
            <div key={`${department}-${query}-${lang}`} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((member, i) => (
                <Reveal key={member.id} delay={Math.min(i, 12) * 40}>
                  <div className="lift-hover group flex flex-col overflow-hidden rounded-2xl border border-plum-100 bg-white shadow-sm hover:shadow-lg hover:shadow-plum-900/10 transition-shadow">
                    {/* Card header with gradient + photo */}
                    <div className={`relative bg-gradient-to-br ${gradients[i % gradients.length]} px-5 pt-6 pb-10`}>
                      {member.grade && (
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                          <GraduationCap className="h-3 w-3" /> {t.grade} {member.grade}
                        </span>
                      )}
                      <div className="flex items-end gap-3">
                        <div className="relative">
                          <img
                            src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6B21A8&color=fff&size=96`}
                            alt={member.name}
                            className="h-16 w-16 rounded-xl object-cover ring-2 ring-white/30"
                          />
                        </div>
                        <div className="min-w-0 pb-0.5">
                          <p className="truncate font-display text-base font-semibold text-white">{member.name}</p>
                          <p className="truncate text-xs text-white/70">{member.title}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col gap-2.5 px-5 pb-5 -mt-5">
                      {member.department && (
                        <span className="self-start rounded-full bg-plum-50 px-3 py-1 text-[11px] font-semibold text-plum-700 ring-1 ring-plum-100">
                          {member.department}
                        </span>
                      )}
                      <div className="mt-1 space-y-2">
                        {member.phone && (
                          <a href={`tel:${member.phone}`}
                            className="flex items-center gap-2 text-xs text-ink-950/60 hover:text-plum-700 transition-colors">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-plum-50 text-plum-600">
                              <Phone className="h-3 w-3" />
                            </span>
                            {member.phone}
                          </a>
                        )}
                        {member.email && (
                          <a href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-xs text-ink-950/60 hover:text-plum-700 transition-colors min-w-0">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-plum-50 text-plum-600">
                              <Mail className="h-3 w-3" />
                            </span>
                            <span className="truncate">{member.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
      </section>
    </div>
  );
}
