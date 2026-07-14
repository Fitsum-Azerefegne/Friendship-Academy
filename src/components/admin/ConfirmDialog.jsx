import { AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", description, confirmLabel = "Delete", loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-ink-950/60">{description}</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2.5">
        <button
          onClick={onClose}
          className="rounded-full border border-plum-200 px-4 py-2 text-sm font-medium text-ink-950/70 hover:bg-plum-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
        >
          {loading ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
