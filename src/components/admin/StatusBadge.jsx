const statusStyles = {
  upcoming: { badge: 'border-sky-300/30 bg-sky-300/10 text-sky-100', dot: 'bg-sky-300' },
  current: { badge: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100', dot: 'bg-emerald-300' },
  passed: { badge: 'border-zinc-300/20 bg-zinc-300/10 text-zinc-200', dot: 'bg-zinc-300' },
  pending: { badge: 'border-amber-300/30 bg-amber-300/10 text-amber-100', dot: 'bg-amber-300' },
  partial: { badge: 'border-orange-300/30 bg-orange-300/10 text-orange-100', dot: 'bg-orange-300' },
  advance: { badge: 'border-orange-300/30 bg-orange-300/10 text-orange-100', dot: 'bg-orange-300' },
  paid: { badge: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100', dot: 'bg-emerald-300' },
  active: { badge: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100', dot: 'bg-emerald-300' },
  inactive: { badge: 'border-red-300/30 bg-red-300/10 text-red-100', dot: 'bg-red-300' },
}

export default function StatusBadge({ status }) {
  const normalized = status || 'pending'
  const selected = statusStyles[normalized] || statusStyles.pending

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold capitalize shadow-sm ${selected.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${selected.dot}`} />
      {normalized}
    </span>
  )
}
