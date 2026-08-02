export default function StatCard({ icon: Icon, value, label, tone = "light" }) {
  const isDark = tone === "dark";
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-5 transition-transform hover:-translate-y-1 ${
        isDark
          ? "border-white/10 bg-white/5"
          : "border-plum-100 bg-white shadow-sm shadow-plum-900/5"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl animate-shimmer-pulse ${
          isDark ? "bg-brass-500/20 text-brass-300" : "bg-plum-50 text-plum-700"
        }`}
      >
        {Icon && <Icon className="h-5 w-5" strokeWidth={1.8} />}
      </div>
      <div>
        <p className={`font-display text-2xl font-semibold ${isDark ? "text-white" : "text-plum-900"}`}>
          {value}
        </p>
        <p className={`text-xs uppercase tracking-wide ${isDark ? "text-white/50" : "text-ink-950/45"}`}>
          {label}
        </p>
      </div>
    </div>
  );
}
