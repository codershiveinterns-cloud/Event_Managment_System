import { Link } from 'react-router-dom'
import { resolveAssetUrl } from '../services/api.js'

function getPriceLabel(event) {
  return event.priceLabel || (typeof event.price === 'number' ? `Starting from ₹${event.price.toLocaleString('en-IN')}` : event.price)
}

export default function EventCard({ event, compact = false }) {
  const eventId = event.id || event._id
  const imageUrl = resolveAssetUrl(event.image || event.imageUrl)
  const priceLabel = getPriceLabel(event)

  if (compact) {
    return (
      <article className="group relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[0.07]">
        <div className="relative h-56 overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={event.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <p className="absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-black/45 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-amber-200 backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:text-xs sm:tracking-[0.24em]">
            {event.category}
          </p>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <h3 className="break-words text-xl font-semibold text-white sm:text-2xl">{event.name}</h3>
          <p className="mt-3 line-clamp-2 break-words leading-7 text-zinc-300">{event.description}</p>
          <p className="mt-5 break-words text-base font-semibold text-amber-200 sm:text-lg">{priceLabel}</p>
          <Link
            to={`/contact?event=${eventId}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-950/20 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Book Now
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[0.07]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="grid min-w-0 gap-0 lg:grid-cols-[16rem_minmax(0,1fr)_auto] lg:items-stretch xl:grid-cols-[18rem_minmax(0,1fr)_auto]">
        <div className="relative min-h-56 overflow-hidden bg-zinc-900 sm:min-h-64 lg:min-h-full">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={event.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>

        <div className="min-w-0 p-5 sm:p-6 lg:p-8">
          <p className="break-words text-xs font-medium uppercase tracking-[0.18em] text-amber-300/70 sm:text-sm sm:tracking-[0.28em]">
            {event.category}
          </p>
          <h3 className="mt-3 break-words text-xl font-semibold text-white sm:text-2xl">{event.name}</h3>
          <p className="mt-3 line-clamp-2 break-words leading-7 text-zinc-300">{event.description}</p>
          <p className="mt-5 break-words text-base font-semibold text-amber-200 sm:text-lg">{priceLabel}</p>
        </div>

        <div className="flex items-center p-5 pt-0 sm:p-6 sm:pt-0 lg:p-8">
          <Link
            to={`/contact?event=${eventId}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-950/20 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-zinc-950 lg:w-auto"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  )
}
