import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { getEvents } from '../services/eventService.js'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl min-w-0">
        <SectionHeader
          eyebrow="Our Events"
          title="Choose the event, we handle the complete experience"
          description="Explore curated event categories designed for weddings, birthdays, corporate functions, and private celebrations."
        />

        {loading ? (
          <p className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-zinc-300">Loading events...</p>
        ) : (
          <div className="mt-12 space-y-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {!events.length && <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-zinc-300">No events available.</p>}
          </div>
        )}
      </div>
    </section>
  )
}
