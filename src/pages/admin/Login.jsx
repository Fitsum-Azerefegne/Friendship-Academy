import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Crest from "../../components/ui/Crest";
import { useAuth } from "../../context/AuthContext";
import { useAdminLang } from "../../context/AdminLangContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { lang, setLang, t } = useAdminLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    const dest = location.state?.from?.pathname || "/admin/dashboard";
    return <Navigate to={dest} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/admin/dashboard");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-plum-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <div
            role="group"
            aria-label="Language"
            className="flex items-center gap-1 rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                lang === "en" ? "bg-brass-500 text-ink-950" : "text-white/60 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("am")}
              aria-pressed={lang === "am"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                lang === "am" ? "bg-brass-500 text-ink-950" : "text-white/60 hover:text-white"
              }`}
            >
              አማ
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center text-center">
          <img src="/Logo.png" alt="Friendship Academy logo" className="h-16 w-16 rounded-full object-cover" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">{t.loginTitle}</h1>
          <p className="mt-1.5 text-sm text-white/50">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-7 shadow-2xl animate-scale-in">
          {error && (
            <div className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="text-sm font-medium text-ink-950/70">{t.email}</label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-950/35" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.edu"
                className="w-full rounded-lg border border-plum-200 py-2.5 pl-10 pr-3.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">{t.password}</label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-950/35" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-plum-200 py-2.5 pl-10 pr-10 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-950/35 hover:text-ink-950/60"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="lift-hover w-full rounded-full bg-plum-800 py-2.5 text-sm font-semibold text-white hover:bg-plum-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? t.signingIn : t.signIn}
          </button>
          <p className="text-center text-xs text-ink-950/35">
            Create your admin user in Supabase (Authentication → Users) to sign in here.
          </p>
        </form>
      </div>
    </div>
  );
}
