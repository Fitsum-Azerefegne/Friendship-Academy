export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="relative overflow-hidden bg-plum-950">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 animate-fade-in-up">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-300">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-xl text-white/60">{description}</p>}
      </div>
    </section>
  );
}
