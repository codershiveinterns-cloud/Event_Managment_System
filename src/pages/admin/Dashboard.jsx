import { useEffect, useState } from 'react'
import BrandLogo from '../../components/BrandLogo.jsx'
import MoneyText from '../../components/admin/MoneyText.jsx'
import StatCard from '../../components/admin/StatCard.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import useAutoHideMessage from '../../hooks/useAutoHideMessage.js'
import { getBookings, getDashboardSummary } from '../../services/adminService.js'

const defaultSummary = {
  counts: {
    totalEvents: 0,
    totalStaff: 0,
    totalBookings: 0,
    upcomingBookings: 0,
    currentBookings: 0,
    passedBookings: 0,
  },
  finances: {
    totalAmount: 0,
    advanceAmount: 0,
    dueAmount: 0,
    staffSalaryAmount: 0,
    netAmount: 0,
    totalRevenue: 0,
    collectedAmount: 0,
    outstandingAmount: 0,
    payrollCommitted: 0,
    projectedNetBalance: 0,
  },
  recentBookings: [],
  recentStaff: [],
}

function EmptyState({ children }) {
  return (
    <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
      {children}
    </p>
  )
}

function bookingOptionLabel(booking) {
  return `${booking.clientName || 'Client'} (${booking.eventNameSnapshot || 'Event'})`
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('en-IN') : 'Not set'
}

function formatEventDate(booking) {
  if (!booking.fromDate && !booking.toDate) return 'Not set'
  if (booking.fromDate && booking.toDate) return `${formatDate(booking.fromDate)} - ${formatDate(booking.toDate)}`
  return formatDate(booking.fromDate || booking.toDate)
}

function getBookingTotal(booking) {
  return booking.totalBudget ?? booking.price ?? booking.totalPrice ?? 0
}

function getBookingDue(booking) {
  return Math.max(0, Number(getBookingTotal(booking)) - Number(booking.downPayment || 0))
}

export default function Dashboard() {
  const [summary, setSummary] = useState(defaultSummary)
  const [bookings, setBookings] = useState([])
  const [selectedBookingId, setSelectedBookingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useAutoHideMessage(error, () => setError(''))

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')

    getDashboardSummary(selectedBookingId)
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedBookingId])

  const { counts, finances, recentBookings, recentStaff } = summary
  const selectedBooking = bookings.find((booking) => booking._id === selectedBookingId)
  const totalAmount = finances.totalAmount ?? finances.totalRevenue
  const advanceAmount = finances.advanceAmount ?? finances.collectedAmount
  const dueAmount = finances.dueAmount ?? finances.outstandingAmount
  const staffSalaryAmount = finances.staffSalaryAmount ?? finances.payrollCommitted
  const netAmount = finances.netAmount ?? finances.projectedNetBalance ?? totalAmount - staffSalaryAmount

  return (
    <section>
      <div className="relative min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_24rem),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_18rem)]" />
        <div className="relative">
          <div className="mb-6">
            <BrandLogo size="sm" />
          </div>
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.35em]">Executive Dashboard</p>
          <h2 className="mt-4 break-words text-3xl font-black tracking-tight text-white sm:text-5xl">Business command center</h2>
          <p className="mt-4 max-w-3xl leading-7 text-zinc-300">
            Manage events, bookings, staff assignments, and financial health from one premium KM Events control center.
          </p>

          <label className="mt-6 block max-w-xl min-w-0">
            <span className="text-sm font-semibold text-zinc-200">Select event/booking</span>
            <select
              value={selectedBookingId}
              onChange={(event) => setSelectedBookingId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
            >
              <option value="">All Bookings</option>
              {bookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {bookingOptionLabel(booking)}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-3 break-words text-sm text-zinc-400">
            {selectedBooking ? `Showing dashboard for ${bookingOptionLabel(selectedBooking)}` : 'Showing all registered bookings'}
          </p>
        </div>
      </div>

      {error && <p className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      {loading && <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-zinc-300">Loading dashboard...</p>}

      <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <StatCard label="Total Events" value={counts.totalEvents} helper="Active event catalog" />
        <StatCard label="Total Staff" value={counts.totalStaff} helper="Registered team" tone="sky" />
        <StatCard label="Bookings" value={counts.totalBookings} helper="All managed events" tone="emerald" />
        <StatCard label="Upcoming Event" value={counts.upcomingBookings} helper="Future events" tone="sky" />
        <StatCard label="Current Event" value={counts.currentBookings} helper="Live events" tone="emerald" />
        <StatCard label="Passed Event" value={counts.passedBookings} helper="Completed events" />
        <StatCard label="Total Amount" value={<MoneyText value={totalAmount} />} helper="Total booked value" tone="emerald" />
        <StatCard label="Advance Amount" value={<MoneyText value={advanceAmount} />} helper="Advance received" tone="sky" />
        <StatCard label="Due Amount" value={<MoneyText value={dueAmount} />} helper="Balance due" tone="rose" />
        <StatCard label="Profit Amount" value={<MoneyText value={netAmount} />} helper="Total minus staff salary" />
      </div>

      <div className="mt-10 grid min-w-0 gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_18rem)]" />
          <div className="relative">
            <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.25em]">Finance</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Financial snapshot</h3>
          </div>

          <div className="relative mt-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm text-zinc-400">Total Amount</p>
              <MoneyText value={totalAmount} className="mt-2 block break-words text-2xl font-bold text-white sm:text-3xl" />
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm text-zinc-400">Staff Salary Amount</p>
              <MoneyText value={staffSalaryAmount} className="mt-2 block break-words text-2xl font-bold text-white sm:text-3xl" />
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm text-zinc-400">Due Amount</p>
              <MoneyText value={dueAmount} className="mt-2 block break-words text-2xl font-bold text-amber-200 sm:text-3xl" />
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm text-zinc-400">Advance Amount</p>
              <MoneyText value={advanceAmount} className="mt-2 block break-words text-2xl font-bold text-sky-200 sm:text-3xl" />
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5 sm:col-span-2 2xl:col-span-2">
              <p className="text-sm text-zinc-400">Profit Amount</p>
              <MoneyText value={netAmount} className="mt-2 block break-words text-2xl font-bold text-emerald-200 sm:text-3xl" />
            </div>
          </div>
        </section>

        <section className="flex h-[32rem] flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.25em]">Recent Staff</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Team assignments</h3>
          <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
            {recentStaff.map((staff) => {
              const eventName = staff.assignedEventNameSnapshot || staff.assignedBooking?.eventNameSnapshot || 'Not assigned'
              const clientName = staff.assignedBookingClientSnapshot || staff.assignedBooking?.clientName || 'Client not set'

              return (
                <div key={staff._id} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-black/25 p-4 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-amber-300/30">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-300 text-lg font-black text-zinc-950 shadow-lg shadow-amber-950/20">
                      {staff.name?.charAt(0)?.toUpperCase() || 'S'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-words text-base font-bold text-white">{staff.name}</p>
                          <p className="mt-1 break-words text-sm text-zinc-400">{staff.designation || 'Team Member'}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2">
                          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-zinc-500">Payment Status</p>
                          <div className="mt-1"><StatusBadge status={staff.paymentStatus} /></div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-amber-300/10 bg-amber-300/[0.06] p-3">
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-amber-200/80">Event Name</p>
                        <p className="mt-1 break-words text-sm font-semibold text-white">{eventName} <span className="text-zinc-400">({clientName})</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {!recentStaff.length && <EmptyState>No staff assigned yet.</EmptyState>}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
        <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.25em]">Bookings</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Booking details</h3>
        <div className="mt-5 max-h-[34rem] overflow-y-auto pr-2">
          <div className="grid gap-4 lg:grid-cols-2">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-black/25 p-5 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-amber-300/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/80">Client Booking</p>
                    <h4 className="mt-2 break-words text-xl font-bold text-white">{booking.clientName}</h4>
                    <p className="mt-1 break-words text-sm font-semibold text-amber-100">{booking.eventNameSnapshot || 'Event not set'}</p>
                    {booking.packageNameSnapshot && <p className="mt-1 break-words text-sm text-zinc-400">Package: {booking.packageNameSnapshot}</p>}
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-5 rounded-3xl border border-amber-300/10 bg-amber-300/[0.06] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200/80">Event Date</p>
                  <p className="mt-2 break-words text-sm font-semibold text-white">{formatEventDate(booking)}</p>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3">
                    <p className="text-xs font-semibold text-zinc-500">Event Days</p>
                    <p className="mt-1 font-bold text-white">{booking.numberOfDays || 0} days</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3">
                    <p className="text-xs font-semibold text-zinc-500">Total</p>
                    <MoneyText value={getBookingTotal(booking)} className="mt-1 block font-bold text-amber-100" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3">
                    <p className="text-xs font-semibold text-zinc-500">Advance</p>
                    <MoneyText value={booking.downPayment} className="mt-1 block font-bold text-sky-100" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3">
                    <p className="text-xs font-semibold text-zinc-500">Due</p>
                    <MoneyText value={getBookingDue(booking)} className="mt-1 block font-bold text-rose-100" />
                  </div>
                </div>
              </div>
            ))}
            {!recentBookings.length && <EmptyState>No bookings yet.</EmptyState>}
          </div>
        </div>
      </section>
    </section>
  )
}
