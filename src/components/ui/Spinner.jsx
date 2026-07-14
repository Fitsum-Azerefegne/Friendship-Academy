export default function Spinner({ size = "md", label = "Loading" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10" role="status" aria-live="polite">
      <span
        className={`${sizes[size]} animate-spin rounded-full border-plum-200 border-t-plum-700`}
      />
      <span className="text-sm text-ink-950/50">{label}</span>
    </div>
  );
}
