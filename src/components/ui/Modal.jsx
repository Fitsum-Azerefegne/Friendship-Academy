import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl shadow-ink-950/20 animate-scale-in`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-plum-100 bg-white px-4 py-3.5 sm:px-6 sm:py-4">
          <h3 className="font-display text-base sm:text-lg font-semibold text-plum-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-950/40 hover:bg-plum-50 hover:text-plum-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
