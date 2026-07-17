import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { siteContent } from '../data/siteContent.js'
import { getContactEvents } from '../services/eventService.js'

function getPriceLabel(event) {
  return event.priceLabel || (typeof event.price === 'number' ? `Starting from ₹${event.price.toLocaleString('en-IN')}` : event.price)
}

const contactCards = [
  { label: 'Email Support', key: 'email' },
  { label: 'Location', key: 'location' },
  { label: 'Working Hours', key: 'hours' },
]

export default function Contact() {
  const [searchParams] = useSearchParams()
  const selectedEventId = searchParams.get('event') || ''
  const [events, setEvents] = useState([])
  const { contact } = siteContent
  const selectedEvent = events.find((event) => event.id === selectedEventId || event._id === selectedEventId)

  useEffect(() => {
    getContactEvents().then(setEvents)
  }, [])

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl min-w-0 gap-10 lg:grid-cols-[0.85fr_minmax(0,1.15fr)] lg:gap-12">
        <div className="min-w-0">
          <SectionHeader
            eyebrow="Contact Us"
            title="Tell us your event idea, we’ll shape a clear and elegant plan."
            description="Share your celebration details and the KM Events team will help you plan a polished, practical, and memorable experience."
          />

          {selectedEvent && (
            <div className="mt-8 min-w-0 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5">
              <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.28em]">Selected Event</p>
              <h3 className="mt-3 break-words text-xl font-semibold text-white sm:text-2xl">{selectedEvent.name}</h3>
              <p className="mt-2 break-words text-zinc-300">{getPriceLabel(selectedEvent)}</p>
            </div>
          )}

          <div className="mt-8 grid gap-4">
            {contactCards.map((item) => (
              <div key={item.key} className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-zinc-300">
                <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.25em]">{item.label}</p>
                <p className={`${item.key === 'email' ? 'break-all' : 'break-words'} mt-3 text-base font-semibold text-white sm:text-lg`}>{contact[item.key]}</p>
              </div>
            ))}
          </div>
        </div>

        <ContactForm events={events} selectedEventId={selectedEventId} />
      </div>
    </section>
  )
}
