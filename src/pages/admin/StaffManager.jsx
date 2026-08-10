import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, ImagePlus, Search, Phone, Mail, GraduationCap } from "lucide-react";
import { getStaff, createStaff, updateStaff, deleteStaff } from "../../api/staff";
import { uploadImage } from "../../lib/storage";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAdminLang } from "../../context/AdminLangContext";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-plum-200 px-3.5 py-2.5 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100";

const emptyForm = { name: "", title: "", department: "", grade: "", phone: "", email: "", photo: "" };

export default function StaffManager() {
  const { t } = useAdminLang();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [photoPreview, setPhotoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await getStaff();
    setStaff(data);
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setPhotoPreview("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({ ...item, grade: item.grade || "", phone: item.phone || "" });
    setPhotoPreview(item.photo || "");
    setModalOpen(true);
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, photoFile: file }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.photoFile) {
        payload.photo = await uploadImage(payload.photoFile, "staff");
      }
      delete payload.photoFile;

      if (editingId) {
        const updated = await updateStaff(editingId, payload);
        setStaff((list) => list.map((s) => (s.id === editingId ? updated : s)));
        toast.success("Staff member updated.");
      } else {
        const created = await createStaff(payload);
        setStaff((list) => [created, ...list]);
        toast.success("Staff member added.");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Couldn't save the staff member.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteStaff(deleteTarget.id);
      setStaff((list) => list.filter((s) => s.id !== deleteTarget.id));
      toast.success("Staff member removed.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Couldn't remove the staff member.");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    (s.grade || "").toLowerCase().includes(query.toLowerCase()) ||
    (s.department || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <AdminPageHeader
        title={t.staffManagerTitle}
        description={t.staffManagerDesc}
        action={
          <button onClick={openCreate}
            className="lift-hover inline-flex items-center gap-2 rounded-full bg-plum-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-plum-700">
            <Plus className="h-4 w-4" /> {t.addStaff}
          </button>
        }
      />

      <div className="relative mt-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-950/35" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, grade, department…"
          className="w-full rounded-full border border-plum-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-100" />
      </div>

      {loading ? <Spinner size="lg" label="Loading staff…" /> : (
        <>
          {/* Summary strip */}
          <div className="mt-5 flex items-center gap-2 text-xs text-ink-950/40">
            <span>{filtered.length} staff member{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Card grid */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="flex items-start gap-4 rounded-2xl border border-plum-100 bg-white p-4 shadow-sm hover:shadow-md hover:shadow-plum-900/8 transition-shadow">
                {/* Avatar */}
                <img
                  src={item.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=6B21A8&color=fff&size=80`}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-plum-900">{item.name}</p>
                      <p className="truncate text-xs text-ink-950/50">{item.title}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-plum-600 hover:bg-plum-50" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.department && (
                      <span className="rounded-full bg-plum-50 px-2.5 py-0.5 text-[11px] font-medium text-plum-700">{item.department}</span>
                    )}
                    {item.grade && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brass-500/10 px-2.5 py-0.5 text-[11px] font-medium text-brass-600">
                        <GraduationCap className="h-3 w-3" /> Grade {item.grade}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    {item.phone && (
                      <p className="flex items-center gap-1.5 text-xs text-ink-950/50">
                        <Phone className="h-3 w-3 shrink-0 text-plum-400" /> {item.phone}
                      </p>
                    )}
                    {item.email && (
                      <p className="flex items-center gap-1.5 text-xs text-ink-950/50 min-w-0">
                        <Mail className="h-3 w-3 shrink-0 text-plum-400" />
                        <span className="truncate">{item.email}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="col-span-full py-12 text-center text-ink-950/40">No staff members found.</p>
            )}
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Staff Member" : "Add Staff Member"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-950/70">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="e.g. Abebe Kebede" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">Job Title</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} placeholder="e.g. Mathematics Teacher" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink-950/70">Department</label>
              <input value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className={inputClass} placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-950/70">Grade / Class</label>
              <input value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} className={inputClass} placeholder="e.g. 5, 9–10, KG" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink-950/70">Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="+251 91 234 5678" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-950/70">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} placeholder="teacher@school.edu" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink-950/70">Photo</label>
            <div className="mt-1.5 flex items-center gap-3">
              {photoPreview
                ? <img src={photoPreview} alt="" className="h-14 w-14 rounded-xl object-cover ring-2 ring-plum-100" />
                : <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-plum-50 text-plum-300"><ImagePlus className="h-6 w-6" /></div>
              }
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-dashed border-plum-300 px-4 py-2.5 text-sm font-medium text-plum-700 hover:bg-plum-50">
                <ImagePlus className="h-4 w-4" /> {photoPreview ? "Replace" : "Upload"} Photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2.5 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="rounded-full border border-plum-200 px-4 py-2 text-sm font-medium text-ink-950/70 hover:bg-plum-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="rounded-full bg-plum-800 px-5 py-2 text-sm font-semibold text-white hover:bg-plum-700 disabled:opacity-60">
              {saving ? "Saving…" : editingId ? "Save Changes" : "Add Staff Member"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        description={`This will permanently remove "${deleteTarget?.name}" from the staff directory.`}
      />
    </div>
  );
}
