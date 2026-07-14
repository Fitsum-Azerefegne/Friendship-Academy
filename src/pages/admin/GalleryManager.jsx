import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, ImagePlus, FolderPlus, Images } from "lucide-react";
import {
  getGallery,
  getGalleryEvents,
  createGalleryEvent,
  deleteGalleryEvent,
  uploadGalleryImage,
  deleteGalleryImage,
} from "../../api/gallery";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAdminLang } from "../../context/AdminLangContext";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";

const CATEGORIES = ["Events", "Sports", "Campus", "Graduation", "Arts"];
const inputClass =
  "mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100";

export default function GalleryManager() {
  const { t } = useAdminLang();
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Upload modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [eventId, setEventId] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // New album (inline within upload modal)
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [newYearEc, setNewYearEc] = useState("");
  const [newTitleAm, setNewTitleAm] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [creatingEvent, setCreatingEvent] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [photoData, eventData] = await Promise.all([getGallery(), getGalleryEvents()]);
    setImages(photoData);
    setEvents(eventData);
    setLoading(false);
  }

  function eventLabel(ev) {
    const year = ev.yearEc || ev.year_ec;
    const am = ev.titleAm || ev.title_am;
    return `${year} E.C. — ${am}`;
  }

  function photoCount(evId) {
    return images.filter((img) => (img.event?.id || img.eventId || img.event_id) === evId).length;
  }

  function openUpload() {
    setCaption("");
    setCategory(CATEGORIES[0]);
    setEventId("");
    setPreview("");
    setFile(null);
    setShowNewEvent(false);
    setNewYearEc("");
    setNewTitleAm("");
    setNewTitleEn("");
    setModalOpen(true);
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleCreateEvent() {
    if (!newYearEc.trim() || !newTitleAm.trim()) {
      toast.error("Year (E.C.) and Amharic title are required.");
      return;
    }
    setCreatingEvent(true);
    try {
      const created = await createGalleryEvent({
        yearEc: newYearEc.trim(),
        titleAm: newTitleAm.trim(),
        titleEn: newTitleEn.trim(),
        category,
      });
      setEvents((list) => [created, ...list]);
      setEventId(created.id);
      setShowNewEvent(false);
      setNewYearEc("");
      setNewTitleAm("");
      setNewTitleEn("");
      toast.success("Album created.");
    } catch (err) {
      toast.error(err.message || "Couldn't create the album.");
    } finally {
      setCreatingEvent(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose an image to upload.");
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);
    formData.append("caption", caption);
    if (eventId) formData.append("eventId", eventId);
    try {
      const created = await uploadGalleryImage(formData);
      setImages((list) => [created, ...list]);
      toast.success("Image uploaded.");
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Couldn't upload the image.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGalleryImage(deleteTarget.id);
      setImages((list) => list.filter((img) => img.id !== deleteTarget.id));
      toast.success("Image deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Couldn't delete the image.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteEvent() {
    if (!deleteEventTarget) return;
    setDeletingEvent(true);
    try {
      await deleteGalleryEvent(deleteEventTarget.id);
      setEvents((list) => list.filter((ev) => ev.id !== deleteEventTarget.id));
      toast.success("Album removed. Its photos were kept.");
      setDeleteEventTarget(null);
    } catch (err) {
      toast.error(err.message || "Couldn't remove the album.");
    } finally {
      setDeletingEvent(false);
    }
  }

  const filtered = filter === "All" ? images : images.filter((img) => img.category === filter);
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => (b.yearEc || b.year_ec).localeCompare(a.yearEc || a.year_ec)),
    [events]
  );

  return (
    <div>
      <AdminPageHeader
        title={t.galleryManagerTitle}
        description={t.galleryManagerDesc}
        action={
          <button
            onClick={openUpload}
            className="lift-hover inline-flex items-center gap-2 rounded-full bg-plum-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-plum-700"
          >
            <Plus className="h-4 w-4" /> {t.uploadImage}
          </button>
        }
      />

      {/* Albums overview */}
      {!loading && sortedEvents.length > 0 && (
        <div className="mt-6 rounded-2xl border border-plum-100 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/40">Albums</p>
          <div className="flex flex-wrap gap-2">
            {sortedEvents.map((ev) => (
              <div
                key={ev.id}
                className="group flex items-center gap-2 rounded-full border border-plum-200 bg-plum-50 py-1.5 pl-3.5 pr-2 text-xs font-medium text-plum-800"
              >
                <span>{eventLabel(ev)}</span>
                <span className="inline-flex items-center gap-1 text-plum-500">
                  <Images className="h-3 w-3" /> {photoCount(ev.id)}
                </span>
                <button
                  onClick={() => setDeleteEventTarget(ev)}
                  className="rounded-full p-1 text-plum-400 hover:bg-white hover:text-red-600"
                  aria-label={`Remove ${eventLabel(ev)} album`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === cat ? "bg-plum-800 text-white" : "border border-plum-200 text-ink-950/60 hover:bg-plum-50 bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner size="lg" label="Loading gallery…" />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img) => {
            const ev = img.event || events.find((e) => e.id === (img.eventId || img.event_id));
            return (
              <div key={img.id} className="group relative overflow-hidden rounded-xl bg-plum-100">
                <img src={img.image} alt={img.caption} className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-ink-950/70 via-transparent to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setDeleteTarget(img)}
                      className="rounded-lg bg-white/90 p-1.5 text-red-600 hover:bg-white"
                      aria-label="Delete image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="truncate text-xs font-medium text-white">{img.caption}</p>
                    <span className="text-[10px] text-white/60">
                      {ev ? eventLabel(ev) : img.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-ink-950/40">No images in this category.</p>
          )}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Image" maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-950/70">Image</label>
            <div className="mt-1.5">
              {preview ? (
                <img src={preview} alt="" className="aspect-video w-full rounded-lg object-cover" />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-plum-300 py-8 text-sm font-medium text-plum-700 hover:bg-plum-50"
                >
                  <ImagePlus className="h-4 w-4" /> Choose Image
                </button>
              )}
              {preview && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-medium text-plum-700 hover:text-plum-500"
                >
                  Choose a different image
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className={inputClass} placeholder="Short description" />
          </div>

          <div className="rounded-lg border border-plum-100 p-3.5">
            <label className="text-sm font-medium text-ink-950/70">Album (optional)</label>
            <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={inputClass}>
              <option value="">No album</option>
              {sortedEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>{eventLabel(ev)}</option>
              ))}
            </select>

            {!showNewEvent ? (
              <button
                type="button"
                onClick={() => setShowNewEvent(true)}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-plum-700 hover:text-plum-500"
              >
                <FolderPlus className="h-3.5 w-3.5" /> Create a new album
              </button>
            ) : (
              <div className="mt-3 space-y-2.5 rounded-lg bg-plum-50 p-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    value={newYearEc}
                    onChange={(e) => setNewYearEc(e.target.value)}
                    placeholder="Year (E.C.) e.g. 2017"
                    className="rounded-lg border border-plum-200 px-3 py-2 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
                  />
                  <input
                    value={newTitleAm}
                    onChange={(e) => setNewTitleAm(e.target.value)}
                    placeholder="Amharic title"
                    className="rounded-lg border border-plum-200 px-3 py-2 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
                  />
                </div>
                <input
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="English title (optional)"
                  className="w-full rounded-lg border border-plum-200 px-3 py-2 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100"
                />
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewEvent(false)}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-ink-950/60 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateEvent}
                    disabled={creatingEvent}
                    className="rounded-full bg-plum-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-plum-700 disabled:opacity-60"
                  >
                    {creatingEvent ? "Creating…" : "Create Album"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-2.5 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-plum-200 px-4 py-2 text-sm font-medium text-ink-950/70 hover:bg-plum-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-full bg-plum-800 px-5 py-2 text-sm font-semibold text-white hover:bg-plum-700 disabled:opacity-60">
              {saving ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        description="This will permanently remove the image from the gallery."
      />

      <ConfirmDialog
        open={!!deleteEventTarget}
        onClose={() => setDeleteEventTarget(null)}
        onConfirm={handleDeleteEvent}
        loading={deletingEvent}
        confirmLabel="Remove Album"
        description="This removes the album, but its photos stay in the gallery (just unassigned)."
      />
    </div>
  );
}
