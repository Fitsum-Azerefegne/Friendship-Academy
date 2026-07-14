import { Link } from "react-router-dom";
import Crest from "../components/ui/Crest";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Crest initial="?" size={56} />
      <h1 className="mt-6 font-display text-3xl font-semibold text-plum-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink-950/50">
        The page you're looking for may have moved or no longer exists.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-plum-800 px-6 py-3 text-sm font-semibold text-white hover:bg-plum-700 transition-colors"
      >
        Back to Homepage
      </Link>
    </div>
  );
}
