export default function ConfirmModal({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 px-4 backdrop-blur-sm sm:px-6">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/40 sm:rounded-[2rem] sm:p-6">
        <h3 className="break-words text-xl font-semibold text-white sm:text-2xl">{title}</h3>
        <p className="mt-3 break-words leading-7 text-zinc-400">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button type="button" onClick={onCancel} className="w-full rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10 sm:flex-1">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="w-full rounded-full bg-red-400 px-5 py-3 font-bold text-zinc-950 transition hover:bg-red-300 sm:flex-1">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
