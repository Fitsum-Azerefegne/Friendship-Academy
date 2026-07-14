import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ImagePlus } from "lucide-react";
import { getContent, updateContent } from "../../api/content";
import { uploadImage } from "../../lib/storage";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAdminLang } from "../../context/AdminLangContext";
import Spinner from "../../components/ui/Spinner";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100";

export default function ContentEditor() {
  const { t } = useAdminLang();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroPreview, setHeroPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const data = await getContent();
      setForm(data);
      setHeroPreview(data.heroImage);
      setLoading(false);
    })();
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateStat(field, value) {
    setForm((f) => ({ ...f, stats: { ...f.stats, [field]: Number(value) || 0 } }));
  }

  function handleHeroChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setHeroPreview(url);
    setForm((f) => ({ ...f, heroImageFile: file }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.heroImageFile) {
        payload.heroImage = await uploadImage(payload.heroImageFile, "hero");
      }
      delete payload.heroImageFile;
      await updateContent(payload);
      toast.success("Content updated.");
    } catch (err) {
      toast.error(err.message || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <Spinner size="lg" label="Loading content editor…" />;

  return (
    <div>
      <AdminPageHeader title={t.contentEditorTitle} description={t.contentEditorDesc} />

      <form onSubmit={handleSave} className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-plum-100 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-plum-900">Hero Section</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-ink-950/70">School Name</label>
                <input
                  value={form.schoolName}
                  onChange={(e) => update("schoolName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-950/70">Tagline</label>
                <input
                  value={form.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-plum-100 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-plum-900">Mission & Vision</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-ink-950/70">Mission Statement</label>
                <textarea
                  rows={3}
                  value={form.mission}
                  onChange={(e) => update("mission", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-950/70">Vision Statement</label>
                <textarea
                  rows={3}
                  value={form.vision}
                  onChange={(e) => update("vision", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-950/70">School History</label>
                <textarea
                  rows={5}
                  value={form.history}
                  onChange={(e) => update("history", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-plum-100 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-plum-900">Quick Stats</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-sm font-medium text-ink-950/70">Students</label>
                <input
                  type="number"
                  value={form.stats.students}
                  onChange={(e) => updateStat("students", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-950/70">Teachers</label>
                <input
                  type="number"
                  value={form.stats.teachers}
                  onChange={(e) => updateStat("teachers", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-950/70">Years Open</label>
                <input
                  type="number"
                  value={form.stats.yearsOpen}
                  onChange={(e) => updateStat("yearsOpen", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-plum-100 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-plum-900">Hero Image</h2>
            <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-plum-100">
              {heroPreview && <img src={heroPreview} alt="Hero preview" className="h-full w-full object-cover" />}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-plum-300 py-3 text-sm font-medium text-plum-700 hover:bg-plum-50"
            >
              <ImagePlus className="h-4 w-4" /> Upload New Image
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroChange} />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-plum-800 py-3 text-sm font-semibold text-white hover:bg-plum-700 disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
