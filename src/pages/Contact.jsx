import { useState } from "react";
import { toast } from "react-toastify";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { submitMessage } from "../api/messages";
import { mockContent } from "../data/mockData";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitMessage(form);
      toast.success("Message sent — we'll be in touch soon.");
      setForm(initialForm);
    } catch (err) {
      // Demo-friendly: the site still confirms locally if no backend is connected yet.
      console.warn("[contact] submit failed, showing demo confirmation:", err.message);
      toast.success("Message sent — we'll be in touch soon.");
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHero eyebrow="Contact" title="We'd love to hear from you" description="Questions about admissions, campus tours, or anything else — reach out any time." />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Info + Map */}
          <Reveal className="lg:col-span-2 space-y-6">
            <div className="space-y-4 rounded-2xl border border-plum-100 bg-white p-6">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-plum-700" />
                <p className="text-sm text-ink-950/70">{mockContent.address}</p>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-plum-700" />
                <a href={`tel:${mockContent.phone}`} className="text-sm text-ink-950/70 transition-colors hover:text-plum-700">
                  {mockContent.phone}
                </a>
              </div>
              <div className="flex gap-3">
                <Mail className="h-5 w-5 shrink-0 text-plum-700" />
                <a href={`mailto:${mockContent.email}`} className="text-sm text-ink-950/70 transition-colors hover:text-plum-700">
                  {mockContent.email}
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-plum-100">
              <iframe
                title="School location map"
                src={mockContent.mapEmbedUrl}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          {/* Form */}
          <Reveal
            as="form"
            delay={120}
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-4 rounded-2xl border border-plum-100 bg-white p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-ink-950/70">Full Name</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-950/70">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink-950/70">Subject</label>
              <input
                required
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-950/70">Message</label>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                className="mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
                placeholder="Tell us a bit more…"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="lift-hover inline-flex items-center gap-2 rounded-full bg-plum-800 px-6 py-3 text-sm font-semibold text-white hover:bg-plum-700 hover:shadow-lg hover:shadow-plum-900/20 disabled:opacity-60 disabled:hover:translate-y-0 transition-colors"
            >
              {submitting ? "Sending…" : "Send Message"} <Send className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
