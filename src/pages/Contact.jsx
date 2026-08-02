import { useState } from "react";
import { toast } from "react-toastify";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { submitMessage } from "../api/messages";
import { mockContent } from "../data/mockData";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import { usePublicLang } from "../context/PublicLangContext";

const T = {
  en: {
    eyebrow: "Contact", title: "We'd love to hear from you",
    desc: "Questions about admissions, campus tours, or anything else — reach out any time.",
    fullName: "Full Name", namePh: "Jane Doe",
    email: "Email Address", emailPh: "jane@example.com",
    subject: "Subject", subjectPh: "How can we help?",
    message: "Message", messagePh: "Tell us a bit more…",
    send: "Send Message", sending: "Sending…",
    success: "Message sent — we'll be in touch soon.",
  },
  am: {
    eyebrow: "አግኙን", title: "ከእርስዎ መስማት እንፈልጋለን",
    desc: "ስለ ምዝገባ፣ የግቢ ጉብኝቶች ወይም ሌላ ጥያቄ ካለዎት — በማንኛውም ጊዜ ያግኙን።",
    fullName: "ሙሉ ስም", namePh: "አበበ ከበደ",
    email: "ኢሜይል አድራሻ", emailPh: "abebe@example.com",
    subject: "ርዕሰ ጉዳይ", subjectPh: "እንዴት ልንረዳዎ እንችላለን?",
    message: "መልዕክት", messagePh: "ትንሽ ተጨማሪ ይንገሩን…",
    send: "መልዕክት ላክ", sending: "በመላክ ላይ…",
    success: "መልዕክቱ ተልኳል — በቅርቡ እናገኝዎታለን።",
  },
};

const initialForm = { name: "", email: "", subject: "", message: "" };
const inputClass = "mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100";

export default function Contact() {
  const { lang } = usePublicLang();
  const t = T[lang];
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitMessage(form);
      toast.success(t.success);
      setForm(initialForm);
    } catch {
      toast.success(t.success);
      setForm(initialForm);
    } finally { setSubmitting(false); }
  }

  return (
    <div>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.desc} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2 space-y-6">
            <div className="space-y-4 rounded-2xl border border-plum-100 bg-white p-6">
              <div className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-plum-700" /><p className="text-sm text-ink-950/70">{mockContent.address}</p></div>
              <div className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-plum-700" /><a href={`tel:${mockContent.phone}`} className="text-sm text-ink-950/70 hover:text-plum-700">{mockContent.phone}</a></div>
              <div className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-plum-700" /><a href={`mailto:${mockContent.email}`} className="text-sm text-ink-950/70 hover:text-plum-700">{mockContent.email}</a></div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-plum-100">
              <iframe title="School location map" src={mockContent.mapEmbedUrl} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </Reveal>

          <Reveal as="form" delay={120} onSubmit={handleSubmit} className="lg:col-span-3 space-y-4 rounded-2xl border border-plum-100 bg-white p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium text-ink-950/70">{t.fullName}</label><input required name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder={t.namePh} /></div>
              <div><label className="text-sm font-medium text-ink-950/70">{t.email}</label><input required type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder={t.emailPh} /></div>
            </div>
            <div><label className="text-sm font-medium text-ink-950/70">{t.subject}</label><input required name="subject" value={form.subject} onChange={handleChange} className={inputClass} placeholder={t.subjectPh} /></div>
            <div><label className="text-sm font-medium text-ink-950/70">{t.message}</label><textarea required name="message" value={form.message} onChange={handleChange} rows={6} className={inputClass} placeholder={t.messagePh} /></div>
            <button type="submit" disabled={submitting} className="lift-hover inline-flex items-center gap-2 rounded-full bg-plum-800 px-6 py-3 text-sm font-semibold text-white hover:bg-plum-700 disabled:opacity-60 transition-colors">
              {submitting ? t.sending : t.send} <Send className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
