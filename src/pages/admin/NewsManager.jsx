import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, ImagePlus, Search } from "lucide-react";
import { getNews, createNews, updateNews, deleteNews } from "../../api/news";
import { uploadImage } from "../../lib/storage";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAdminLang } from "../../context/AdminLangContext";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../utils/format";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100";

const emptyForm = {
  title: "", excerpt: "", body: "", category: "Academics", author: "", date: "", image: "",
};

export default function NewsManager() {
  const { t } = useAdminLang();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await getNews();
    setNews(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setImagePreview("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({ ...item });
    setImagePreview(item.image);
    setModalOpen(true);
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, imageFile: file }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.imageFile) {
        payload.image = await uploadImage(payload.imageFile, "news");
      }
      delete payload.imageFile;

      if (editingId) {
        const updated = await updateNews(editingId, payload);
        setNews((list) => list.map((n) => (n.id === editingId ? updated : n)));
        toast.success("Article updated.");
      } else {
        const created = await createNews(payload);
        setNews((list) => [created, ...list]);
        toast.success("Article published.");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Couldn't save the article.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNews(deleteTarget.id);
      setNews((list) => list.filter((n) => n.id !== deleteTarget.id));
      toast.success("Article deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Couldn't delete the article.");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = news.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title={t.newsManagerTitle}
        description={t.newsManagerDesc}
        action={
          <button
            onClick={openCreate}
            className="lift-hover inline-flex items-center gap-2 rounded-full bg-plum-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-plum-700"
          >
            <Plus className="h-4 w-4" /> {t.newArticle}
          </button>
        }
      />

      <div className="relative mt-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-950/35" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="w-full rounded-full border border-plum-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
        />
      </div>

      {loading ? (
        <Spinner size="lg" label="Loading articles…" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-plum-100 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-plum-100 text-xs uppercase tracking-wide text-ink-950/40">
                <th className="px-5 py-3.5 font-semibold">Article</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plum-100">
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                      <span className="font-medium text-plum-900 line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-950/60">{item.category}</td>
                  <td className="px-5 py-3.5 text-ink-950/60">{formatDate(item.date)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-lg p-2 text-plum-700 hover:bg-plum-50"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-ink-950/40">
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Article" : "New Article"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-950/70">Title</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink-950/70">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={inputClass}
              >
                {["Academics", "Sports", "Arts", "Campus", "Community"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink-950/70">Publish Date</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">Author</label>
            <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">Excerpt</label>
            <textarea rows={2} required value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">Full Article</label>
            <textarea rows={5} required value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">Cover Image</label>
            <div className="mt-1.5 flex items-center gap-3">
              {imagePreview && <img src={imagePreview} alt="" className="h-14 w-20 rounded-lg object-cover" />}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-dashed border-plum-300 px-4 py-2.5 text-sm font-medium text-plum-700 hover:bg-plum-50"
              >
                <ImagePlus className="h-4 w-4" /> {imagePreview ? "Replace" : "Upload"} Image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2.5 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-plum-200 px-4 py-2 text-sm font-medium text-ink-950/70 hover:bg-plum-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-full bg-plum-800 px-5 py-2 text-sm font-semibold text-white hover:bg-plum-700 disabled:opacity-60">
              {saving ? "Saving…" : editingId ? "Save Changes" : "Publish Article"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        description={`This will permanently delete "${deleteTarget?.title}". This action can't be undone.`}
      />
    </div>
  );
}
