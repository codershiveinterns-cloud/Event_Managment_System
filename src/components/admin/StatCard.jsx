export default function StatCard({ label, value, helper, tone = 'amber' }) {
  const tones = {
    amber: {
      glow: 'from-amber-300/20 via-white/[0.04] to-white/[0.02]',
      accent: 'bg-amber-300',
      text: 'text-amber-200',
      border: 'hover:border-amber-300/40',
    },
    emerald: {
      glow: 'from-emerald-300/15 via-white/[0.04] to-white/[0.02]',
      accent: 'bg-emerald-300',
      text: 'text-emerald-200',
      border: 'hover:border-emerald-300/40',
    },
    sky: {
      glow: 'from-sky-300/15 via-white/[0.04] to-white/[0.02]',
      accent: 'bg-sky-300',
      text: 'text-sky-200',
      border: 'hover:border-sky-300/40',
    },
    rose: {
      glow: 'from-rose-300/15 via-white/[0.04] to-white/[0.02]',
      accent: 'bg-rose-300',
      text: 'text-rose-200',
      border: 'hover:border-rose-300/40',
    },
  }
  const selected = tones[tone] || tones.amber

  return (
    <article className={`group relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 ${selected.border}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${selected.glow} opacity-80`} />
      <div className="relative min-w-0">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <p className="min-w-0 break-words text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400 sm:tracking-[0.24em]">{label}</p>
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${selected.accent} shadow-lg`} />
        </div>
        <p className={`mt-4 break-words text-2xl font-black tracking-tight text-white tabular-nums sm:text-3xl ${selected.text}`}>{value}</p>
        {helper && <p className="mt-3 break-words text-sm leading-6 text-zinc-400">{helper}</p>}
      </div>
    </article>
  )
}
