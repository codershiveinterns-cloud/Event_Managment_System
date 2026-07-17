import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import Hero from '../components/Hero.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { getFeaturedEvents } from '../services/eventService.js'
import { getGalleryImages } from '../services/galleryService.js'

const highlights = [
  { value: 'Design', label: 'Elegant themes and decor direction for every event style' },
  { value: 'Plan', label: 'Clear timelines, vendor coordination, and practical details' },
  { value: 'Execute', label: 'Calm event-day support so hosts can enjoy the moment' },
]

function EmptyState({ children }) {
  return (
    <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center text-zinc-300">
      {children}
    </p>
  )
}

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [galleryLoading, setGalleryLoading] = useState(true)

  useEffect(() => {
    getFeaturedEvents()
      .then(setFeaturedEvents)
      .finally(() => setEventsLoading(false))

    getGalleryImages()
      .then(setGalleryImages)
      .finally(() => setGalleryLoading(false))
  }, [])

  return (
    <>
      <Hero />

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl min-w-0 gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label} className="min-w-0 rounded-3xl bg-black/20 p-5 text-center sm:p-6">
              <p className="break-words text-2xl font-bold text-amber-200 sm:text-3xl">{item.value}</p>
              <p className="mt-2 break-words text-sm leading-6 text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl min-w-0">
          <div className="flex min-w-0 flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Signature Events"
              title="Premium planning for every special moment"
              description="Choose from carefully designed event categories for weddings, birthdays, corporate functions, and private celebrations."
            />
            <Link to="/events" className="w-full rounded-full border border-amber-300/40 px-6 py-3 text-center font-semibold text-amber-100 transition hover:bg-amber-300 hover:text-zinc-950 sm:w-fit">
              View All Events
            </Link>
          </div>

          {eventsLoading ? (
            <div className="mt-10">
              <EmptyState>Loading featured events...</EmptyState>
            </div>
          ) : featuredEvents.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState>No featured events available.</EmptyState>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl min-w-0">
          <SectionHeader
            align="center"
            eyebrow="Image Gallery"
            title="A glimpse of elegant celebration moments"
            description="Explore event setups, thoughtful details, and celebration spaces crafted with a premium planning approach."
          />
          <div className="mt-12">
            {galleryLoading ? (
              <EmptyState>Loading gallery...</EmptyState>
            ) : galleryImages.length ? (
              <GalleryGrid images={galleryImages} />
            ) : (
              <EmptyState>No gallery images available.</EmptyState>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl min-w-0 overflow-hidden rounded-[2rem] border border-amber-300/25 bg-zinc-950/80 p-[1px] shadow-2xl shadow-amber-950/20 sm:rounded-[2.75rem]">
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.34),transparent_22rem),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.22),transparent_18rem),linear-gradient(135deg,rgba(24,24,27,0.95),rgba(9,9,11,0.98))] px-6 py-10 text-center sm:rounded-[calc(2.75rem-1px)] sm:px-12 sm:py-14 lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute -left-24 top-8 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-purple-400/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

            <div className="relative mx-auto max-w-4xl">
              <span className="inline-flex rounded-full border border-amber-200/25 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-100 shadow-lg shadow-amber-950/20 sm:tracking-[0.35em]">
                Start Planning
              </span>
              <h2 className="mx-auto mt-6 max-w-3xl break-words text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Let’s make your next event feel effortless, polished, and unforgettable.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                Premium planning, elegant details, and calm execution — all handled with care from the first call to the final celebration.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/contact" className="group inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-300 to-yellow-200 px-8 py-4 font-black text-black shadow-xl shadow-amber-950/30 transition hover:-translate-y-0.5 hover:shadow-amber-300/20 sm:w-auto">
                  Contact Us Today
                  <span className="ml-2 transition group-hover:translate-x-1">→</span>
                </Link>
                <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold text-zinc-300">
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">Custom Decor</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">Vendor Support</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">Event-Day Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
