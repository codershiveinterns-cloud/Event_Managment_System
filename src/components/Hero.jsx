import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo.jsx'
import { siteContent } from '../data/siteContent.js'

export default function Hero() {
  const { hero } = siteContent

  return (
    <section className="relative isolate overflow-hidden px-4 pb-12 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_20%,rgba(245,158,11,0.22),transparent_30rem),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.10),transparent_22rem)]" />
      <div className="mx-auto grid max-w-7xl min-w-0 items-center gap-10 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:gap-12">
        <div className="min-w-0">
          <p className="mb-5 inline-flex max-w-full break-words rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.28em]">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-4xl break-words text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:mt-7 sm:text-xl sm:leading-8">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link
              to="/events"
              className="w-full rounded-full bg-amber-300 px-8 py-4 text-center font-bold text-zinc-950 shadow-xl shadow-amber-950/20 transition hover:bg-amber-200 sm:w-auto"
            >
              Explore Events
            </Link>
            <Link
              to="/contact"
              className="w-full rounded-full border border-white/15 px-8 py-4 text-center font-bold text-white transition hover:border-amber-300/60 hover:bg-white/10 sm:w-auto"
            >
              Plan My Event
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl min-w-0">
          <div className="absolute -inset-3 rounded-[2rem] bg-amber-300/20 blur-2xl sm:-inset-6 sm:rounded-[3rem] sm:blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/40 backdrop-blur sm:rounded-[2.5rem]">
            <img
              src="/images/events/hero.jpg"
              alt="Elegant event decoration by KM Events"
              className="h-[26rem] w-full object-cover sm:h-[30rem] lg:h-[34rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-9">
              <BrandLogo size="sm" />
              <p className="mt-4 break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:mt-6 sm:text-sm sm:tracking-[0.32em]">
                Ajmer Event Specialists
              </p>
              <h2 className="mt-3 break-words text-2xl font-semibold leading-tight text-white sm:mt-4 sm:text-4xl">
                Thoughtful planning, polished styling, and calm event-day coordination.
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-200 sm:mt-4 sm:text-base sm:leading-7">
                We align decor, guest flow, vendors, and timelines so your celebration feels effortless from start to finish.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
                {['Elegant Decor', 'Clear Planning', 'Smooth Flow'].map((item) => (
                  <div key={item} className="rounded-2xl bg-black/35 p-3 text-center text-xs font-semibold text-amber-100 backdrop-blur sm:p-4 sm:text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
