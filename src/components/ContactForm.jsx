import { useEffect, useState } from 'react'
import useAutoHideMessage from '../hooks/useAutoHideMessage.js'

const initialForm = {
  name: '',
  email: '',
  eventId: '',
  eventDate: '',
  guests: '',
  message: '',
}

export default function ContactForm({ events, selectedEventId = '' }) {
  const [formData, setFormData] = useState({ ...initialForm, eventId: selectedEventId })
  const [status, setStatus] = useState('idle')

  useAutoHideMessage(status === 'success' ? status : '', () => setStatus('idle'))

  useEffect(() => {
    setFormData((current) => ({ ...current, eventId: selectedEventId }))
  }, [selectedEventId])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const inquiryPayload = {
      ...formData,
      source: 'website-contact-form',
    }

    console.log('Event inquiry payload:', inquiryPayload)
    setStatus('success')
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/25 backdrop-blur sm:p-8">
      {status === 'success' && (
        <p className="mb-5 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-medium text-emerald-100">
          Your inquiry sent successfully.
        </p>
      )}

      <div className="grid min-w-0 gap-5 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Full Name</span>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300"
            placeholder="Your name"
          />
        </label>

        <label className="block min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Email</span>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300"
            placeholder="you@example.com"
          />
        </label>

        <label className="block min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Interested Event</span>
          <select
            required
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300"
          >
            <option value="">Select an event</option>
            {events.map((event) => {
              const eventId = event.id || event._id
              return (
                <option key={eventId} value={eventId}>
                  {event.name}
                </option>
              )
            })}
            <option value="other">Other</option>
          </select>
        </label>

        <label className="block min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Event Date</span>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300"
          />
        </label>

        <label className="block min-w-0 sm:col-span-2">
          <span className="text-sm font-semibold text-zinc-200">Guest Count</span>
          <input
            type="number"
            min="1"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300"
            placeholder="150"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-zinc-200">Tell us about your event</span>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300"
          placeholder="Venue, theme, budget range, special requirements..."
        />
      </label>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-amber-300 px-8 py-4 font-bold text-zinc-950 shadow-xl shadow-amber-950/20 transition hover:bg-amber-200"
      >
        Send Inquiry
      </button>
    </form>
  )
}
