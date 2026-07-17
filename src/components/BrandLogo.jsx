import { Link } from 'react-router-dom'

const sizes = {
  sm: {
    mark: 'h-11 w-11',
    title: 'text-xl',
    subtitle: 'text-[0.62rem]',
  },
  md: {
    mark: 'h-12 w-12',
    title: 'text-xl',
    subtitle: 'text-[0.62rem]',
  },
  lg: {
    mark: 'h-14 w-14',
    title: 'text-2xl',
    subtitle: 'text-[0.62rem]',
  },
}

function LogoMark({ size = 'md' }) {
  const selected = sizes[size]

  return (
    <span className={`relative grid ${selected.mark} shrink-0 place-items-center overflow-hidden rounded-2xl bg-zinc-950 shadow-xl shadow-amber-950/30`}>
      <svg viewBox="0 0 64 64" role="img" className="h-full w-full" aria-label="KM">
        <title>KM</title>
        <defs>
          <linearGradient id="kmMarkGold" x1="12" y1="4" x2="54" y2="62" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff8dc" />
            <stop offset="0.28" stopColor="#f8d36b" />
            <stop offset="0.58" stopColor="#d99621" />
            <stop offset="0.86" stopColor="#8f4d12" />
            <stop offset="1" stopColor="#ffe9a3" />
          </linearGradient>
          <radialGradient id="kmMarkGlow" cx="23" cy="13" r="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff4c2" stopOpacity="0.45" />
            <stop offset="0.44" stopColor="#f59e0b" stopOpacity="0.16" />
            <stop offset="1" stopColor="#09090b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill="#09090b" />
        <rect width="64" height="64" rx="18" fill="url(#kmMarkGlow)" />
        <path d="M32 5 54 17v30L32 59 10 47V17z" fill="#0c0a09" stroke="url(#kmMarkGold)" strokeWidth="3" />
        <path d="M32 12 48 21v22L32 52 16 43V21z" fill="rgba(251,191,36,0.08)" stroke="url(#kmMarkGold)" strokeWidth="1.4" />
        <g transform="translate(-4.5 0)">
          <path d="M17 42V22h4.9v8.1L30.3 22h6L27 31.1 37.1 42h-6.2l-7.2-8.5-1.8 1.8V42z" fill="#fff7d6" stroke="#09090b" strokeWidth="0.8" paintOrder="stroke" />
          <path d="M35.2 42V22h5l5.5 8.7 5.5-8.7h5v20h-4.8V30.4l-5.5 8.3h-.3l-5.5-8.2V42z" fill="#fff7d6" stroke="#09090b" strokeWidth="0.8" paintOrder="stroke" />
        </g>
        <path d="M32 1.5 33.6 6l4.6 1.7-4.6 1.7L32 14l-1.6-4.6-4.6-1.7L30.4 6z" fill="#fff2b8" />
      </svg>
    </span>
  )
}

export default function BrandLogo({ asLink = false, size = 'md', onClick, className = '' }) {
  const selected = sizes[size]

  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="KM Events">
      <LogoMark size={size} />
      <span className="leading-none">
        <span className={`block font-semibold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] ${selected.title}`}>Events</span>
        <span className={`mt-1 block font-semibold uppercase tracking-[0.28em] text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] ${selected.subtitle}`}>
          Premium Planning
        </span>
      </span>
    </span>
  )

  if (asLink) {
    return (
      <Link to="/" onClick={onClick} className="inline-flex items-center rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-300/70" aria-label="KM Events home">
        {content}
      </Link>
    )
  }

  return content
}
