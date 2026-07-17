import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import DetailModal from '../../components/admin/DetailModal.jsx'
import MoneyText from '../../components/admin/MoneyText.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import useAutoHideMessage from '../../hooks/useAutoHideMessage.js'
import { createStaff, deleteStaff, getBookings, getStaff, updateStaff } from '../../services/adminService.js'

const initialForm = {
  name: '',
  mobileNo: '',
  address: '',
  designation: '',
  assignedBookingId: '',
  duties: '',
  dutyNotes: '',
  totalSalary: '',
  paymentStatus: 'pending',
  advancePayment: '',
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

function bookingOptionLabel(booking) {
  const days = booking.numberOfDays || calculateDays(booking.fromDate, booking.toDate)
  return `${booking.clientName} (${booking.eventNameSnapshot}) - ${formatDate(booking.fromDate)} to ${formatDate(booking.toDate)}${days ? ` • ${days} days` : ''}`
}

function getAssignedBooking(staff) {
  return staff?.assignedBooking && typeof staff.assignedBooking === 'object' ? staff.assignedBooking : null
}

function getStaffEventName(staff) {
  const booking = getAssignedBooking(staff)
  return staff?.assignedEventNameSnapshot || booking?.eventNameSnapshot || staff?.assignedEvent?.name || 'Not assigned'
}

function getStaffClientName(staff) {
  const booking = getAssignedBooking(staff)
  return staff?.assignedBookingClientSnapshot || booking?.clientName || 'Not available'
}

function getStaffDutyDays(staff) {
  const booking = getAssignedBooking(staff)
  return Number(booking?.numberOfDays || calculateDays(booking?.fromDate, booking?.toDate) || 0)
}

function getStaffDateRange(staff) {
  const booking = getAssignedBooking(staff)
  if (!booking) return 'Not available'
  return `${formatDate(booking.fromDate)} - ${formatDate(booking.toDate)}`
}

function getStaffPaymentDue(staff) {
  return Math.max(0, Number(staff?.totalSalary || 0) - Number(staff?.advancePayment || 0))
}

function getDutyList(staff) {
  return Array.isArray(staff?.duties) ? staff.duties.filter(Boolean) : []
}

function staffAssignment(staff) {
  const booking = getAssignedBooking(staff)
  const eventName = getStaffEventName(staff)
  if (booking) {
    const days = getStaffDutyDays(staff)
    return `${getStaffClientName(staff)} • ${eventName}${days ? ` • ${days} days` : ''}`
  }
  return `${eventName} • Legacy event assignment`
}

function normalizePaymentStatus(status) {
  return status === 'partial' ? 'advance' : status || 'pending'
}

function DetailTile({ label, children, className = '' }) {
  return (
    <div className={`min-w-0 rounded-3xl border border-white/10 bg-white/[0.05] p-4 ${className}`}>
      <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 sm:tracking-[0.24em]">{label}</p>
      <div className="mt-2 break-words text-base font-semibold text-white">{children}</div>
    </div>
  )
}

function InfoChip({ children, className = '' }) {
  return <span className={`max-w-full break-words rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-zinc-200 ring-1 ring-white/10 ${className}`}>{children}</span>
}

export default function AddStaff() {
  const [formData, setFormData] = useState(initialForm)
  const [bookings, setBookings] = useState([])
  const [staffList, setStaffList] = useState([])
  const [editingId, setEditingId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredStaffList = normalizedSearchTerm
    ? staffList.filter((staff) => [
      staff.name,
      staff.mobileNo,
      staff.address,
      staff.designation,
      staffAssignment(staff),
      getStaffEventName(staff),
      getStaffClientName(staff),
      getStaffDateRange(staff),
      normalizePaymentStatus(staff.paymentStatus),
      staff.totalSalary,
      staff.advancePayment,
      ...getDutyList(staff),
      staff.dutyNotes,
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedSearchTerm)))
    : staffList

  useAutoHideMessage(error, () => setError(''))
  useAutoHideMessage(message, () => setMessage(''))

  async function loadData() {
    try {
      const [bookingData, staffData] = await Promise.all([getBookings(), getStaff()])
      setBookings(bookingData)
      setStaffList(staffData)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function resetForm() {
    setFormData(initialForm)
    setEditingId('')
  }

  function handleChange(event) {
    const { name, value } = event.target

    if (name === 'paymentStatus') {
      setFormData((current) => ({
        ...current,
        paymentStatus: value,
        advancePayment: value === 'advance' ? current.advancePayment : '',
      }))
      return
    }

    setFormData((current) => ({ ...current, [name]: value }))
  }

  function startEdit(staff) {
    const paymentStatus = normalizePaymentStatus(staff.paymentStatus)
    setEditingId(staff._id)
    setFormData({
      name: staff.name || '',
      mobileNo: staff.mobileNo || '',
      address: staff.address || '',
      designation: staff.designation || '',
      assignedBookingId: String(staff.assignedBooking?._id || staff.assignedBooking || ''),
      duties: Array.isArray(staff.duties) ? staff.duties.join('\n') : '',
      dutyNotes: staff.dutyNotes || '',
      totalSalary: staff.totalSalary || '',
      paymentStatus,
      advancePayment: paymentStatus === 'advance' ? staff.advancePayment || '' : '',
    })
    setMessage(`Editing ${staff.name}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const payload = {
        ...formData,
        totalSalary: Number(formData.totalSalary),
        advancePayment: formData.paymentStatus === 'advance' ? Number(formData.advancePayment || 0) : 0,
      }
      if (editingId) {
        await updateStaff(editingId, payload)
        setMessage('Staff updated successfully.')
      } else {
        await createStaff(payload)
        setMessage('Staff registered successfully.')
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
      await deleteStaff(deleteTarget._id)
      setDeleteTarget(null)
      setMessage('Staff deleted successfully.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="flex min-w-0 flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div className="min-w-0">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.35em]">Staff Manager</p>
          <h2 className="mt-4 break-words text-3xl font-bold text-white sm:text-4xl">Manage duties, salary and assignments</h2>
          <p className="mt-3 max-w-3xl break-words text-zinc-400">Assign staff to exact events, track salary per event, duties, and payment status in one place.</p>
        </div>
        {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/10">Cancel Edit</button>}
      </div>

      <div className="mt-8 space-y-8">
        <form onSubmit={handleSubmit} className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 sm:p-6">
          {error && <p className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
          {message && <p className="mb-5 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}

          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            <label className="block min-w-0"><span className="text-sm font-semibold text-zinc-200">Name</span><input required name="name" value={formData.name} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block min-w-0"><span className="text-sm font-semibold text-zinc-200">Mobile No.</span><input required name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block min-w-0"><span className="text-sm font-semibold text-zinc-200">Designation</span><input name="designation" value={formData.designation} onChange={handleChange} placeholder="Event Manager, Decor Lead, Hospitality" className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block min-w-0"><span className="text-sm font-semibold text-zinc-200">Salary per Event</span><input required type="number" min="0" name="totalSalary" value={formData.totalSalary} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block min-w-0"><span className="text-sm font-semibold text-zinc-200">Payment Status</span><select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300"><option value="pending">Pending</option><option value="advance">Advance</option><option value="paid">Paid</option></select></label>
            {formData.paymentStatus === 'advance' && <label className="block min-w-0"><span className="text-sm font-semibold text-zinc-200">Advance Payment</span><input required type="number" min="0" name="advancePayment" value={formData.advancePayment} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>}
            <label className="block min-w-0 md:col-span-2"><span className="text-sm font-semibold text-zinc-200">Address</span><input required name="address" value={formData.address} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block min-w-0 md:col-span-2"><span className="text-sm font-semibold text-zinc-200">Assign Event</span><select required name="assignedBookingId" value={formData.assignedBookingId} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300"><option value="">Select booking</option>{bookings.map((booking) => <option key={booking._id} value={booking._id}>{bookingOptionLabel(booking)}</option>)}</select></label>
            <label className="block min-w-0 md:col-span-2"><span className="text-sm font-semibold text-zinc-200">Duties / Tasks</span><textarea name="duties" rows="4" value={formData.duties} onChange={handleChange} placeholder="One duty per line: guest handling, stage setup, vendor coordination..." className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
            <label className="block min-w-0 md:col-span-2"><span className="text-sm font-semibold text-zinc-200">Duty Notes</span><textarea name="dutyNotes" rows="3" value={formData.dutyNotes} onChange={handleChange} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" /></label>
          </div>

          <div className="mt-6 flex justify-end">
            <button disabled={loading} className="w-auto rounded-full bg-amber-300 px-6 py-3 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-60">
              {loading ? 'Saving...' : editingId ? 'Update Staff' : 'Register Staff'}
            </button>
          </div>
        </form>

        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Team Roster</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Staff List ({staffList.length})</h3>
            </div>
            <p className="text-sm text-zinc-400">{normalizedSearchTerm ? `${filteredStaffList.length} of ${staffList.length} members` : `${staffList.length} members`}</p>
          </div>
          <label className="mt-5 block max-w-md">
            <span className="sr-only">Search staff</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search staff by name, mobile, designation, event..."
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-amber-300"
            />
          </label>
          <div className="mt-5 max-h-[600px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredStaffList.map((staff) => {
                const paymentStatus = normalizePaymentStatus(staff.paymentStatus)
                const duties = getDutyList(staff)
                const booking = getAssignedBooking(staff)
                return (
                  <article key={staff._id} className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/35">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div className="flex min-w-0 gap-3">
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-300 text-xl font-black text-zinc-950 shadow-lg shadow-amber-950/20">{staff.name?.charAt(0)?.toUpperCase() || 'S'}</span>
                        <div className="min-w-0">
                          <h4 className="break-words text-lg font-bold text-white">{staff.name}</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <InfoChip>{staff.designation || 'Team Member'}</InfoChip>
                            {booking?.status && <StatusBadge status={booking.status} />}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <StatusBadge status={paymentStatus} />
                        <MoneyText value={staff.totalSalary} className="text-sm font-bold text-amber-200" />
                        {paymentStatus === 'advance' && <p className="text-xs text-zinc-400">Advance: <MoneyText value={staff.advancePayment} /></p>}
                      </div>
                    </div>

                    <div className="mt-5 rounded-3xl border border-amber-300/10 bg-amber-300/[0.06] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200/80">Duty Assignment</p>
                      <h5 className="mt-2 font-bold text-white">{getStaffEventName(staff)}</h5>
                      <p className="mt-1 text-sm text-zinc-300">{staffAssignment(staff)}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <InfoChip>{getStaffClientName(staff)}</InfoChip>
                        <InfoChip>{getStaffDateRange(staff)}</InfoChip>
                        <InfoChip className="text-amber-100 ring-amber-300/20">{getStaffDutyDays(staff) || 'No'} days</InfoChip>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {duties.slice(0, 4).map((duty) => <span key={duty} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10">{duty}</span>)}
                      {duties.length > 4 && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10">+{duties.length - 4} more</span>}
                      {!duties.length && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-500 ring-1 ring-white/10">No duties added</span>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setViewTarget(staff)} className="rounded-full border border-sky-300/30 bg-sky-300/5 px-3 py-2 text-sm font-bold text-sky-100 transition hover:bg-sky-300/10">View</button>
                      <button type="button" onClick={() => startEdit(staff)} className="rounded-full bg-amber-300 px-3 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-200">Edit</button>
                      <button type="button" onClick={() => setDeleteTarget(staff)} className="rounded-full border border-red-300/30 bg-red-300/5 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-300/10">Delete</button>
                    </div>
                  </article>
                )
              })}
              {!filteredStaffList.length && <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center text-zinc-400 md:col-span-2">{staffList.length ? 'No staff match your search.' : 'No staff registered yet.'}</p>}
            </div>
          </div>
        </div>
      </div>

      <DetailModal open={Boolean(viewTarget)} title={viewTarget?.name || 'Staff Details'} onClose={() => setViewTarget(null)} maxWidth="max-w-5xl">
        {viewTarget && (
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-300/10 to-white/[0.03] p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="flex gap-4">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-amber-300 text-2xl font-black text-zinc-950">{viewTarget.name?.charAt(0)?.toUpperCase() || 'S'}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">Staff Duty Profile</p>
                    <h3 className="mt-2 text-3xl font-black text-white">{viewTarget.name}</h3>
                    <p className="mt-2 text-zinc-300">{viewTarget.designation || 'Team Member'} • {viewTarget.mobileNo}</p>
                  </div>
                </div>
                <StatusBadge status={normalizePaymentStatus(viewTarget.paymentStatus)} />
              </div>
            </div>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Assigned Duty Event</p>
                  <h4 className="mt-2 text-2xl font-black text-white">{getStaffEventName(viewTarget)}</h4>
                  <p className="mt-2 text-zinc-400">{getAssignedBooking(viewTarget) ? 'Booking linked duty details' : 'Legacy event assignment'}</p>
                </div>
                {getAssignedBooking(viewTarget)?.status && <StatusBadge status={getAssignedBooking(viewTarget).status} />}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailTile label="Booking Client">{getStaffClientName(viewTarget)}</DetailTile>
                <DetailTile label="Event Days">{getStaffDutyDays(viewTarget) || 'Not available'}</DetailTile>
                <DetailTile label="Date Range">{getStaffDateRange(viewTarget)}</DetailTile>
                <DetailTile label="From Date">{formatDate(getAssignedBooking(viewTarget)?.fromDate)}</DetailTile>
                <DetailTile label="To Date">{formatDate(getAssignedBooking(viewTarget)?.toDate)}</DetailTile>
                <DetailTile label="Booking Mobile">{getAssignedBooking(viewTarget)?.mobileNo || 'Not available'}</DetailTile>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Booking Address</p>
                  <p className="mt-2 leading-7 text-white">{getAssignedBooking(viewTarget)?.address || 'No booking address available.'}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Booking Notes</p>
                  <p className="mt-2 whitespace-pre-line leading-7 text-white">{getAssignedBooking(viewTarget)?.notes || 'No booking notes added.'}</p>
                </div>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Staff Details</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailTile label="Mobile">{viewTarget.mobileNo}</DetailTile>
                  <DetailTile label="Designation">{viewTarget.designation || 'Team Member'}</DetailTile>
                  <DetailTile label="Created">{formatDateTime(viewTarget.createdAt)}</DetailTile>
                  <DetailTile label="Updated">{formatDateTime(viewTarget.updatedAt)}</DetailTile>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Address</p>
                    <p className="mt-2 leading-7 text-white">{viewTarget.address}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Salary & Payment</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailTile label="Salary per Event"><MoneyText value={viewTarget.totalSalary} /></DetailTile>
                  <DetailTile label="Payment Status">{normalizePaymentStatus(viewTarget.paymentStatus)}</DetailTile>
                  <DetailTile label="Advance Payment"><MoneyText value={viewTarget.advancePayment} /></DetailTile>
                  <DetailTile label="Remaining Salary"><MoneyText value={normalizePaymentStatus(viewTarget.paymentStatus) === 'paid' ? 0 : getStaffPaymentDue(viewTarget)} /></DetailTile>
                </div>
              </section>
            </div>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/80">Duties & Notes</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {getDutyList(viewTarget).map((duty) => <span key={duty} className="rounded-full bg-white/[0.07] px-3 py-1 text-sm text-zinc-200 ring-1 ring-white/10">{duty}</span>)}
                {!getDutyList(viewTarget).length && <span className="rounded-full bg-white/[0.07] px-3 py-1 text-sm text-zinc-500 ring-1 ring-white/10">No duties added</span>}
              </div>
              <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Duty Notes</p>
                <p className="mt-2 whitespace-pre-line leading-7 text-white">{viewTarget.dutyNotes || 'No duty notes added.'}</p>
              </div>
            </section>
          </div>
        )}
      </DetailModal>

      <ConfirmModal open={Boolean(deleteTarget)} title="Delete staff?" message="This staff record will be permanently deleted." confirmLabel="Delete Staff" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
    </section>
  )
}
