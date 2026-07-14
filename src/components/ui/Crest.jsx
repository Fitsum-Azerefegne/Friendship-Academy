// A simple monogram "seal" — the site's one recurring signature element.
// Renders the school's initial inside a two-ring badge, echoing a wax seal.
export default function Crest({ initial = "A", size = 40, tone = "plum" }) {
  const ring = tone === "light" ? "#FFFFFF" : "#4E2277";
  const fill = tone === "light" ? "rgba(255,255,255,0.08)" : "#F8F3FC";
  const text = tone === "light" ? "#FFFFFF" : "#33144E";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" fill={fill} stroke={ring} strokeWidth="1.4" />
      <circle cx="24" cy="24" r="17.5" fill="none" stroke={ring} strokeWidth="1" opacity="0.55" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="20"
        fontWeight="600"
        fill={text}
      >
        {initial}
      </text>
    </svg>
  );
}
