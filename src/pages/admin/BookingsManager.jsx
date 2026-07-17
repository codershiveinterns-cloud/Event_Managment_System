import { useEffect, useMemo, useState } from 'react'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import DetailModal from '../../components/admin/DetailModal.jsx'
import MoneyText from '../../components/admin/MoneyText.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import useAutoHideMessage from '../../hooks/useAutoHideMessage.js'
import { createBooking, deleteBooking, getAdminEvents, getBookings, updateBooking } from '../../services/adminService.js'

const initialForm = {
  clientName: '',
  mobileNo: '',
  address: '',
  eventId: '',
  fromDate: '',
  toDate: '',
  price: '',
  downPayment: '',
  status: 'upcoming',
  notes: '',
}

const filters = ['all', 'upcoming', 'current', 'passed']

function toDateInput(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('en-IN') : 'Not set'
}

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not available'
}

function calculateDays(fromDate, toDate) {
  if (!fromDate || !toDate) return 0
  const from = new Date(fromDate)
  const to = new Date(toDate)
  const diff = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  if (diff < 0) return 0
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

function getBookingBudget(booking) {
  return Number(booking.totalBudget ?? booking.price ?? booking.totalPrice ?? 0)
}

function getBookingDue(booking) {
  return getBookingBudget(booking) - Number(booking.downPayment || 0)
}

function getSafeBookingDue(booking) {
  return Math.max(0, getBookingDue(booking))
}

function getBookingDays(booking) {
  return Number(booking.numberOfDays || calculateDays(booking.fromDate, booking.toDate) || 0)
}

function getPaymentProgress(booking) {
  const budget = getBookingBudget(booking)
  const paid = Number(booking.downPayment || 0)
  if (budget <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((paid / budget) * 100)))
}

function formatDateRange(booking) {
  return `${formatDate(booking.fromDate)} - ${formatDate(booking.toDate)}`
}

function BookingMetric({ label, children, tone = 'white' }) {
  const tones = {
    amber: 'text-amber-100 bg-amber-300/10 ring-amber-300/20',
    emerald: 'text-emerald-100 bg-emerald-300/10 ring-emerald-300/20',
    rose: 'text-rose-100 bg-rose-300/10 ring-rose-300/20',
    sky: 'text-sky-100 bg-sky-300/10 ring-sky-300/20',
    white: 'text-white bg-white/[0.05] ring-white/10',
  }

  return (
    <div className={`min-w-0 rounded-3xl p-4 ring-1 ${tones[tone] || tones.white}`}>
      <p className="break-words text-xs font-bold uppercase tracking-[0.16em] opacity-70 sm:tracking-[0.24em]">{label}</p>
      <div className="mt-2 break-words text-base font-black sm:text-lg">{children}</div>
    </div>
  )
}

function InfoChip({ children, className = '' }) {
  return <span className={`max-w-full break-words rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-zinc-200 ring-1 ring-white/10 ${className}`}>{children}</span>
}

function PaymentProgressBar({ booking }) {
  const progress = getPaymentProgress(booking)

  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-zinc-400">
        <span>Payment progress</span>
        <span>{progress}% collected</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default function BookingsManager() {
  const [formData, setFormData] = useState(initialForm)
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [editingId, setEditingId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredBookings = normalizedSearchTerm
    ? bookings.filter((booking) => [
      booking.clientName,
      booking.mobileNo,
      booking.address,
      booking.eventNameSnapshot,
      formatDateRange(booking),
      booking.status,
      booking.notes,
      getBookingBudget(booking),
      booking.downPayment,
      getSafeBookingDue(booking),
      getBookingDays(booking),
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedSearchTerm)))
    : bookings

  useAutoHideMessage(error, () => setError(''))
  useAutoHideMessage(message, () => setMessage(''))

  const numberOfDays = useMemo(() => calculateDays(formData.fromDate, formData.toDate), [formData.fromDate, formData.toDate])
  const totalBudget = Number(formData.price || 0)
  const balanceDue = totalBudget - Number(formData.downPayment || 0)

  async function loadData() {
    try {
      const [eventData, bookingData] = await Promise.all([getAdminEvents(), getBookings(activeFilter === 'all' ? '' : activeFilter)])
      setEvents(eventData)
      setBookings(bookingData)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [activeFilter])

  function resetForm() {
    setFormData(initialForm)
    setEditingId('')
  }

  function handleChange(event) {
    const { name, value } = event.target

    if (name === 'eventId') {
      setFormData((current) => ({
        ...current,
        eventId: value,
      }))
      return
    }

    setFormData((current) => ({ ...current, [name]: value }))
  }

  function startEdit(booking) {
    setEditingId(booking._id)
    const eventId = booking.event?._id || booking.event || ''
    setFormData({
      clientName: booking.clientName || '',
      mobileNo: booking.mobileNo || '',
      address: booking.address || '',
      eventId: String(eventId),
      fromDate: toDateInput(booking.fromDate),
      toDate: toDateInput(booking.toDate),
      price: booking.totalBudget ?? booking.price ?? booking.totalPrice ?? '',
      downPayment: booking.downPayment || '',
      status: booking.status || 'upcoming',
      notes: booking.notes || '',
    })
    setMessage(`Editing booking for ${booking.clientName}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const totalBudget = Number(formData.price)
      const payload = { ...formData, price: totalBudget, totalBudget, downPayment: Number(formData.downPayment || 0) }
      if (editingId) {
        await updateBooking(editingId, payload)
        setMessage('Booking updated successfully.')
      } else {
        await createBooking(payload)
        setMessage('Booking saved successfully.')
      }
      resetForm()
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteBooking(deleteTarget._id)
      setDeleteTarget(null)
      setMessage('Booking deleted successfully.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="flex min-w-0 flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div className="min-w-0">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.35em]">Bookings Manager</p>
          <h2 className="mt-4 break-words text-3xl font-bold text-white sm:text-4xl">Manage event lifecycle and finances</h2>
          <p className="mt-3 max-w-3xl break-words text-zinc-400">Client details, event dates, total budget, advance amount, due amount and event status in one place.</p>
        </div>
        {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/10">Cancel Edit</button>}
      </div>

      <div className="mt-8 space-y-8">
        <form onSubmit={handleSubmit} className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 sm:p-6">
          {error && <p className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
          {message && <p className="mb-5 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}

          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            <label className="block"><span className="text-sm font-semibold text-zinc-200">Client Name</span><input required name="clientName" value={formData.clientName} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block"><span className="text-sm font-semibold text-zinc-200">Mobile No.</span><input required name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block sm:col-span-2"><span className="text-sm font-semibold text-zinc-200">Address</span><input required name="address" value={formData.address} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block"><span className="text-sm font-semibold text-zinc-200">Event Type</span><select required name="eventId" value={formData.eventId} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300"><option value="">Select event</option>{events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}</select></label>
            <label className="block"><span className="text-sm font-semibold text-zinc-200">Event Date From</span><input required type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block"><span className="text-sm font-semibold text-zinc-200">Event Date To</span><input required type="date" name="toDate" value={formData.toDate} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block"><span className="text-sm font-semibold text-zinc-200">Total Budget</span><input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block"><span className="text-sm font-semibold text-zinc-200">Advance Amount</span><input type="number" min="0" name="downPayment" value={formData.downPayment} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <div className="rounded-2xl bg-black/25 p-4"><p className="text-sm text-zinc-400">No. of Days</p><p className="mt-1 text-2xl font-bold text-amber-200">{numberOfDays}</p></div>
            <div className="rounded-2xl bg-black/25 p-4"><p className="text-sm text-zinc-400">Total Budget</p><MoneyText value={totalBudget} className="mt-1 block text-2xl font-bold text-amber-200" /></div>
            <div className="rounded-2xl bg-black/25 p-4"><p className="text-sm text-zinc-400">Pending Amount</p><MoneyText value={balanceDue < 0 ? 0 : balanceDue} className="mt-1 block text-2xl font-bold text-rose-200" /></div>
            <label className="block"><span className="text-sm font-semibold text-zinc-200">Status</span><select name="status" value={formData.status} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300"><option value="upcoming">Upcoming</option><option value="current">Current</option><option value="passed">Passed</option></select></label>
            <label className="block sm:col-span-2"><span className="text-sm font-semibold text-zinc-200">Notes / Special Requirements</span><textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
          </div>

          <div className="mt-6 flex justify-end">
            <button disabled={loading} className="w-auto rounded-full bg-amber-300 px-6 py-3 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-60">
              {loading ? 'Saving...' : editingId ? 'Update Booking' : 'Save Booking'}
            </button>
          </div>
        </form>

        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Reservations</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Bookings List ({bookings.length})</h3>
              <p className="mt-2 text-sm text-zinc-400">{normalizedSearchTerm ? `${filteredBookings.length} of ${bookings.length} shown` : `${bookings.length} shown`}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${activeFilter === filter ? 'bg-gradient-to-r from-amber-300 to-yellow-200 text-zinc-950 shadow-lg shadow-amber-950/20' : 'border border-white/10 bg-white/[0.03] text-zinc-300 hover:border-amber-300/30 hover:bg-white/[0.08]'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-5 block max-w-md">
            <span className="sr-only">Search bookings</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search bookings by client, event, mobile, status..."
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-amber-300"
            />
          </label>
          <div className="mt-5 max-h-[600px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredBookings.map((booking) => (
                <article key={booking._id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/35">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div className="flex min-w-0 gap-3">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-300 text-xl font-black text-zinc-950 shadow-lg shadow-amber-950/20">{booking.clientName?.charAt(0)?.toUpperCase() || 'B'}</span>
                      <div className="min-w-0">
                        <h4 className="break-words text-lg font-bold text-white">{booking.clientName}</h4>
                        <p className="mt-1 break-words text-sm text-zinc-400">{booking.mobileNo}</p>
                        <p className="mt-1 break-words text-sm font-semibold text-amber-100">{booking.eventNameSnapshot}</p>
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mt-5 rounded-3xl border border-amber-300/10 bg-amber-300/[0.06] p-4">
                    <div className="flex flex-wrap gap-2">
                      <InfoChip>{formatDateRange(booking)}</InfoChip>
                      <InfoChip className="text-amber-100 ring-amber-300/20">{getBookingDays(booking)} days</InfoChip>
                      <InfoChip>{booking.status || 'upcoming'}</InfoChip>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <BookingMetric label="Total Budget" tone="amber"><MoneyText value={getBookingBudget(booking)} /></BookingMetric>
                    <BookingMetric label="Advance" tone="emerald"><MoneyText value={booking.downPayment} /></BookingMetric>
                    <BookingMetric label="Due" tone="rose"><MoneyText value={getSafeBookingDue(booking)} /></BookingMetric>
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                    <PaymentProgressBar booking={booking} />
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-400">{booking.address}</p>
                    {booking.notes && <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">Notes: {booking.notes}</p>}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setViewTarget(booking)} className="rounded-full border border-sky-300/30 bg-sky-300/5 px-3 py-2 text-sm font-bold text-sky-100 transition hover:bg-sky-300/10">View</button>
                    <button type="button" onClick={() => startEdit(booking)} className="rounded-full bg-amber-300 px-3 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-200">Edit</button>
                    <button type="button" onClick={() => setDeleteTarget(booking)} className="rounded-full border border-red-300/30 bg-red-300/5 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-300/10">Delete</button>
                  </div>
                </article>
              ))}
              {!filteredBookings.length && <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center text-zinc-400 md:col-span-2">{bookings.length ? 'No bookings match your search.' : 'No bookings yet.'}</p>}
            </div>
          </div>
        </div>
      </div>

      <DetailModal open={Boolean(viewTarget)} title={viewTarget ? `${viewTarget.clientName} Booking` : 'Booking Details'} onClose={() => setViewTarget(null)} maxWidth="max-w-5xl">
        {viewTarget && (
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-300/10 to-white/[0.03] p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="flex gap-4">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-amber-300 text-2xl font-black text-zinc-950">{viewTarget.clientName?.charAt(0)?.toUpperCase() || 'B'}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">Client Booking</p>
                    <h3 className="mt-2 text-3xl font-black text-white">{viewTarget.clientName}</h3>
                    <p className="mt-2 text-zinc-300">{viewTarget.mobileNo} • {viewTarget.eventNameSnapshot}</p>
                  </div>
                </div>
                <StatusBadge status={viewTarget.status} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <BookingMetric label="Duration" tone="sky">{getBookingDays(viewTarget)} days</BookingMetric>
              <BookingMetric label="Total Budget" tone="amber"><MoneyText value={getBookingBudget(viewTarget)} /></BookingMetric>
              <BookingMetric label="Advance" tone="emerald"><MoneyText value={viewTarget.downPayment} /></BookingMetric>
              <BookingMetric label="Pending" tone="rose"><MoneyText value={getSafeBookingDue(viewTarget)} /></BookingMetric>
            </div>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <PaymentProgressBar booking={viewTarget} />
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <BookingMetric label="Event" tone="white">{viewTarget.eventNameSnapshot || 'Not set'}</BookingMetric>
              <BookingMetric label="Date Range" tone="white">{formatDateRange(viewTarget)}</BookingMetric>
              <BookingMetric label="From Date" tone="white">{formatDate(viewTarget.fromDate)}</BookingMetric>
              <BookingMetric label="To Date" tone="white">{formatDate(viewTarget.toDate)}</BookingMetric>
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Address</p>
                <p className="mt-2 leading-7 text-white">{viewTarget.address || 'Not added'}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Notes / Special Requirements</p>
                <p className="mt-2 whitespace-pre-line leading-7 text-white">{viewTarget.notes || 'No special notes added.'}</p>
              </div>
              <BookingMetric label="Created" tone="white">{formatDateTime(viewTarget.createdAt)}</BookingMetric>
              <BookingMetric label="Updated" tone="white">{formatDateTime(viewTarget.updatedAt)}</BookingMetric>
            </div>
          </div>
        )}
      </DetailModal>

      <ConfirmModal open={Boolean(deleteTarget)} title="Delete booking?" message="This booking will be permanently deleted." confirmLabel="Delete Booking" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
    </section>
  )
}
