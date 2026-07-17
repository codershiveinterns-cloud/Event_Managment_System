import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import DetailModal from '../../components/admin/DetailModal.jsx'
import MoneyText from '../../components/admin/MoneyText.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import useAutoHideMessage from '../../hooks/useAutoHideMessage.js'
import { addAdminEvent, deleteAdminEvent, getAdminEvents, updateAdminEvent } from '../../services/adminService.js'
import { resolveAssetUrl } from '../../services/api.js'

const initialForm = {
  name: '',
  category: '',
  shortSummary: '',
  description: '',
  price: '',
  featured: false,
  isActive: true,
  image: null,
}

function hydrateEvent(event) {
  return {
    name: event.name || '',
    category: event.category || '',
    shortSummary: event.shortSummary || '',
    description: event.description || '',
    price: event.price || '',
    featured: Boolean(event.featured),
    isActive: Boolean(event.isActive),
    image: null,
  }
}

function getEventImage(event) {
  return event?.image || event?.imageUrl || ''
}

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not available'
}

function DetailTile({ label, value, children, className = '' }) {
  return (
    <div className={`min-w-0 rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-lg shadow-black/10 ${className}`}>
      <p className="break-words text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 sm:tracking-[0.24em]">{label}</p>
      <div className="mt-2 break-words text-base font-semibold text-white">{children || value}</div>
    </div>
  )
}

function BooleanPill({ active, trueLabel, falseLabel }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? 'bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-300/30' : 'bg-white/5 text-zinc-300 ring-1 ring-white/10'}`}>
      {active ? trueLabel : falseLabel}
    </span>
  )
}

function EventPlaceholder({ name, className = '' }) {
  return (
    <div className={`grid place-items-center bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.25),transparent_35%),linear-gradient(135deg,rgba(39,39,42,1),rgba(9,9,11,1))] ${className}`}>
      <span className="text-4xl font-black text-amber-100/90">{name?.charAt(0)?.toUpperCase() || 'E'}</span>
    </div>
  )
}

export default function AddEvent() {
  const [formData, setFormData] = useState(initialForm)
  const [events, setEvents] = useState([])
  const [editingId, setEditingId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredEvents = normalizedSearchTerm
    ? events.filter((event) => [
      event.name,
      event.category,
      event.shortSummary,
      event.description,
      event.price,
      event.isActive ? 'active visible added to events' : 'inactive hidden',
      event.featured ? 'featured home featured' : 'hidden home hidden',
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedSearchTerm)))
    : events

  useAutoHideMessage(error, () => setError(''))
  useAutoHideMessage(message, () => setMessage(''))

  async function loadEvents() {
    try {
      const data = await getAdminEvents()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  function resetForm() {
    setFormData(initialForm)
    setEditingId('')
  }

  function handleChange(event) {
    const { name, value, type, checked, files } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    }))
  }

  function startEdit(event) {
    setEditingId(event.id)
    setFormData(hydrateEvent(event))
    setMessage(`Editing ${event.name}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function buildPayload() {
    const payload = new FormData()
    payload.append('name', formData.name)
    payload.append('category', formData.category)
    payload.append('shortSummary', formData.shortSummary)
    payload.append('description', formData.description)
    payload.append('price', formData.price)
    payload.append('featured', String(formData.featured))
    payload.append('isActive', String(formData.isActive))
    if (formData.image) payload.append('image', formData.image)
    return payload
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (editingId) {
        await updateAdminEvent(editingId, buildPayload())
        setMessage('Event saved successfully.')
      } else {
        await addAdminEvent(buildPayload())
        setMessage('Event saved successfully.')
      }
      resetForm()
      event.target.reset()
      await loadEvents()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteAdminEvent(deleteTarget.id)
      setDeleteTarget(null)
      if (editingId === deleteTarget.id) resetForm()
      setEvents((current) => current.filter((event) => event.id !== deleteTarget.id))
      setMessage('Event deleted successfully.')
      await loadEvents()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="flex min-w-0 flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div className="min-w-0">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.35em]">Events Manager</p>
          <h2 className="mt-4 break-words text-3xl font-bold text-white sm:text-4xl">Create and edit events</h2>
          <p className="mt-3 max-w-3xl break-words text-zinc-400">Manage event details, images, pricing, and website placement controls.</p>
        </div>
        {editingId && (
          <button type="button" onClick={resetForm} className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/10">
            Cancel Edit
          </button>
        )}
      </div>

      <div className="mt-8 space-y-8">
        <form onSubmit={handleSubmit} className="min-w-0 space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 sm:p-6">
          {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
          {message && <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}

          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-zinc-200">Event Name</span>
              <input required name="name" value={formData.name} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-200">Category</span>
              <input required name="category" value={formData.category} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-200">Starting Price</span>
              <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-200">Image</span>
              <input type="file" accept="image/*" name="image" onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:font-bold file:text-zinc-950" />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-zinc-200">Short Summary</span>
            <input name="shortSummary" value={formData.shortSummary} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" placeholder="Premium wedding planning with decor, hospitality and flawless execution" />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-zinc-200">Detailed Description</span>
            <textarea required name="description" rows="4" value={formData.description} onChange={handleChange} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" />
          </label>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-5 w-5 accent-amber-300" />
              Also add to home page
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-5 w-5 accent-amber-300" />
              Add to events
            </label>
          </div>

          <div className="flex justify-end">
            <button disabled={loading} className="w-auto rounded-full bg-amber-300 px-6 py-3 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-60">
              {loading ? 'Saving...' : editingId ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>

        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Library</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Registered Events ({events.length})</h3>
            </div>
            <p className="text-sm text-zinc-400">{normalizedSearchTerm ? `${filteredEvents.length} of ${events.length} total` : `${events.length} total`}</p>
          </div>
          <label className="mt-5 block max-w-md">
            <span className="sr-only">Search events</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search events by name, category, summary..."
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-amber-300"
            />
          </label>
          <div className="mt-5 max-h-[600px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredEvents.map((event) => {
                const image = getEventImage(event)

                return (
                  <article key={event.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-4 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/40">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {image ? (
                        <img src={resolveAssetUrl(image)} alt={event.name} className="h-36 w-full rounded-2xl object-cover shadow-lg shadow-black/30 sm:w-36" />
                      ) : (
                        <EventPlaceholder name={event.name} className="h-36 w-full rounded-2xl sm:w-36" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h4 className="break-words text-lg font-bold text-white">{event.name}</h4>
                            <p className="mt-1 break-words text-sm text-zinc-400">{event.category || 'Uncategorized'}</p>
                          </div>
                          <StatusBadge status={event.isActive ? 'active' : 'inactive'} />
                        </div>
                        <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-zinc-400">{event.shortSummary || event.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-100 ring-1 ring-amber-300/20">Starting <MoneyText value={event.price} /></span>
                          <BooleanPill active={event.featured} trueLabel="Home Featured" falseLabel="Home Hidden" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                      <button type="button" onClick={() => setViewTarget(event)} className="rounded-full border border-sky-300/30 bg-sky-300/5 px-3 py-2 text-sm font-bold text-sky-100 transition hover:bg-sky-300/10">View</button>
                      <button type="button" onClick={() => startEdit(event)} className="rounded-full bg-amber-300 px-3 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-200">Edit</button>
                      <button type="button" onClick={() => setDeleteTarget(event)} className="rounded-full border border-red-300/30 bg-red-300/5 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-300/10">Delete</button>
                    </div>
                  </article>
                )
              })}
              {!filteredEvents.length && <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center text-zinc-400 md:col-span-2">{events.length ? 'No events match your search.' : 'No events added yet.'}</p>}
            </div>
          </div>
        </div>
      </div>

      <DetailModal open={Boolean(viewTarget)} title={viewTarget?.name || 'Event Details'} onClose={() => setViewTarget(null)} maxWidth="max-w-6xl">
        {viewTarget && (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
              {getEventImage(viewTarget) ? (
                <img src={resolveAssetUrl(getEventImage(viewTarget))} alt={viewTarget.name} className="h-56 w-full object-cover sm:h-80" />
              ) : (
                <EventPlaceholder name={viewTarget.name} className="h-56 w-full sm:h-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-200">{viewTarget.category || 'Event'}</p>
                    <h3 className="mt-2 text-3xl font-black text-white sm:text-4xl">{viewTarget.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={viewTarget.isActive ? 'active' : 'inactive'} />
                    <BooleanPill active={viewTarget.featured} trueLabel="Shown on home" falseLabel="Not on home" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DetailTile label="Category" value={viewTarget.category || 'Not added'} />
              <DetailTile label="Starting Price"><MoneyText value={viewTarget.price} /></DetailTile>
              <DetailTile label="Events Page" value={viewTarget.isActive ? 'Visible' : 'Hidden'} />
              <DetailTile label="Home Page" value={viewTarget.featured ? 'Featured' : 'Not featured'} />
              <DetailTile label="Created" value={formatDateTime(viewTarget.createdAt)} />
              <DetailTile label="Updated" value={formatDateTime(viewTarget.updatedAt)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Short Summary</p>
                <p className="mt-3 leading-7 text-zinc-200">{viewTarget.shortSummary || 'No short summary added.'}</p>
              </section>
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Detailed Description</p>
                <p className="mt-3 whitespace-pre-line leading-7 text-zinc-200">{viewTarget.description || 'No description added.'}</p>
              </section>
            </div>
          </div>
        )}
      </DetailModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete page?"
        message="This event will be permanently deleted from the database. Existing bookings will remain safe."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
