export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brass-600">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-plum-900 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-ink-950/60 text-base leading-relaxed">{description}</p>
      )}
    </div>
  );
}
