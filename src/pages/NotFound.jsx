import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Big 404 */}
      <div className="relative select-none">
        <p className="font-display text-[8rem] font-semibold leading-none text-plum-100 sm:text-[10rem]">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-plum-800 shadow-lg shadow-plum-900/30">
            <span className="font-display text-2xl font-bold text-white">?</span>
          </div>
        </div>
      </div>

      <h1 className="mt-4 font-display text-2xl font-semibold text-plum-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink-950/50 leading-relaxed">
        The page you're looking for may have moved or no longer exists.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/"
          className="lift-hover inline-flex items-center gap-2 rounded-full bg-plum-800 px-6 py-3 text-sm font-semibold text-white hover:bg-plum-700 transition-colors">
          <Home className="h-4 w-4" /> Back to Homepage
        </Link>
        <button onClick={() => window.history.back()}
          className="lift-hover inline-flex items-center gap-2 rounded-full border border-plum-200 px-6 py-3 text-sm font-semibold text-plum-800 hover:bg-plum-50 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    </div>
  );
}
