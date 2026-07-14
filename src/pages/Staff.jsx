import { useEffect, useMemo, useState } from "react";
import { Search, Mail } from "lucide-react";
import { getStaff } from "../api/staff";
import PageHero from "../components/ui/PageHero";
import Spinner from "../components/ui/Spinner";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");

  useEffect(() => {
    (async () => {
      const data = await getStaff();
      setStaff(data);
      setLoading(false);
    })();
  }, []);

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(staff.map((s) => s.department)))],
    [staff]
  );

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      const matchesDept = department === "All" || s.department === department;
      const matchesQuery =
        query.trim() === "" ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.title.toLowerCase().includes(query.toLowerCase());
      return matchesDept && matchesQuery;
    });
  }, [staff, department, query]);

  return (
    <div>
      <PageHero eyebrow="Our People" title="Staff Directory" description="Find and connect with faculty and staff across departments." />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-950/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or title…"
              className="w-full rounded-full border border-plum-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-950/35 focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-full border border-plum-200 bg-white px-4 py-2.5 text-sm sm:w-auto focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <Spinner size="lg" label="Loading staff directory…" />
        ) : filtered.length === 0 ? (
          <p className="mt-12 text-center text-ink-950/50">No staff members match your search.</p>
        ) : (
          <div key={`${department}-${query}`} className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((member, i) => (
              <div
                key={member.id}
                className="lift-hover rounded-2xl border border-plum-100 bg-white p-5 text-center hover:shadow-md hover:shadow-plum-900/10 animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              >
                <img src={member.photo} alt={member.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
                <p className="mt-3 text-sm font-semibold text-plum-900">{member.name}</p>
                <p className="text-xs text-ink-950/50">{member.title}</p>
                <span className="mt-2 inline-block rounded-full bg-plum-50 px-2.5 py-1 text-[11px] font-medium text-plum-700">
                  {member.department}
                </span>
                <a
                  href={`mailto:${member.email}`}
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs text-plum-700 transition-colors hover:text-plum-500"
                >
                  <Mail className="h-3.5 w-3.5" /> {member.email}
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
