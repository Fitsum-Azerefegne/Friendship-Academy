import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Mail, MailOpen, Trash2, X } from "lucide-react";
import { getMessages, markMessageRead, deleteMessage } from "../../api/messages";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAdminLang } from "../../context/AdminLangContext";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../utils/format";

export default function Messages() {
  const { t } = useAdminLang();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  }

  async function openMessage(msg) {
    setSelected(msg);
    if (!msg.read) {
      try {
        const updated = await markMessageRead(msg.id);
        setMessages((list) => list.map((m) => (m.id === msg.id ? updated : m)));
      } catch (err) {
        toast.error(err.message || "Couldn't mark this message as read.");
      }
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMessage(deleteTarget.id);
      setMessages((list) => list.filter((m) => m.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success("Message deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Couldn't delete this message.");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = filter === "Unread" ? messages.filter((m) => !m.read) : messages;

  return (
    <div>
      <AdminPageHeader title={t.messagesTitle} description={t.messagesDesc} />

      <div className="mt-6 flex gap-2">
        {["All", "Unread"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f ? "bg-plum-800 text-white" : "border border-plum-200 bg-white text-ink-950/60 hover:bg-plum-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner size="lg" label="Loading messages…" />
      ) : (
        <div className="mt-6 divide-y divide-plum-100 rounded-2xl border border-plum-100 bg-white">
          {filtered.map((msg) => (
            <button
              key={msg.id}
              onClick={() => openMessage(msg)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-plum-50 transition-colors"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${msg.read ? "bg-plum-50 text-plum-400" : "bg-brass-500/15 text-brass-600"}`}>
                {msg.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`truncate text-sm ${msg.read ? "font-medium text-ink-950/70" : "font-semibold text-plum-900"}`}>
                    {msg.subject}
                  </p>
                  {!msg.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500" />}
                </div>
                <p className="truncate text-xs text-ink-950/45">{msg.name} · {msg.email}</p>
              </div>
              <span className="shrink-0 text-xs text-ink-950/35">{formatDate(msg.created_at)}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center text-ink-950/40">No messages here.</p>
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl animate-scale-in">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-plum-900 break-words">{selected.subject}</p>
                <p className="mt-1 text-sm text-ink-950/50 break-words">
                  {selected.name} &middot; {selected.email}
                </p>
                <p className="text-xs text-ink-950/35">{formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="shrink-0 rounded-full p-1.5 text-ink-950/40 hover:bg-plum-50" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink-950/70">{selected.message}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-2.5">
              <a
                href={`mailto:${selected.email}`}
                className="rounded-full border border-plum-200 px-4 py-2 text-sm font-medium text-plum-800 hover:bg-plum-50"
              >
                Reply by Email
              </a>
              <button
                onClick={() => setDeleteTarget(selected)}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        description="This will permanently delete this message."
      />
    </div>
  );
}
