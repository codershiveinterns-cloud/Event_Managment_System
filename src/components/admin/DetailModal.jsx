export default function DetailModal({ open, title, children, onClose, maxWidth = 'max-w-3xl' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-x-hidden bg-black/80 px-3 py-4 backdrop-blur-md sm:px-4 sm:py-6" role="dialog" aria-modal="true">
      <div className={`relative max-h-[92vh] w-full ${maxWidth} min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60 sm:max-h-[88vh] sm:rounded-[2.25rem]`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_34%)]" />
        <div className="relative flex min-w-0 flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className="break-words text-xs font-bold uppercase tracking-[0.18em] text-amber-200/80 sm:tracking-[0.32em]">Detailed View</p>
            <h2 className="mt-2 break-words text-lg font-bold text-white sm:text-2xl">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="w-full shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-amber-100 sm:w-auto">
            Close
          </button>
        </div>
        <div className="relative max-h-[calc(92vh-8rem)] overflow-y-auto overflow-x-hidden p-4 text-zinc-300 sm:max-h-[calc(88vh-6.5rem)] sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
