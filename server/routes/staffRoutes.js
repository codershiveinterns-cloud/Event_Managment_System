const express = require('express')
const Staff = require('../models/Staff')
const Event = require('../models/Event')
const Booking = require('../models/Booking')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

function normalizePaymentStatus(paymentStatus) {
  const normalized = paymentStatus === 'partial' ? 'advance' : paymentStatus
  return ['pending', 'advance', 'paid'].includes(normalized) ? normalized : 'pending'
}

async function buildStaffPayload(body) {
  const { name, mobileNo, address, designation, assignedBookingId, assignedEventId, duties, dutyNotes, totalSalary, paymentStatus, advancePayment } = body

  if (!name || !mobileNo || !address || (!assignedBookingId && !assignedEventId) || totalSalary === undefined || totalSalary === '') {
    return { error: 'Name, mobile, address, assigned event and salary are required' }
  }

  const salary = Number(totalSalary)
  if (Number.isNaN(salary) || salary < 0) return { error: 'Salary per event must be a valid positive number' }

  const safePaymentStatus = normalizePaymentStatus(paymentStatus)
  const advanceAmount = safePaymentStatus === 'advance' ? Number(advancePayment) : 0

  if (safePaymentStatus === 'advance' && (advancePayment === undefined || advancePayment === '')) {
    return { error: 'Advance payment amount is required when payment status is advance' }
  }

  if (Number.isNaN(advanceAmount) || advanceAmount < 0) {
    return { error: 'Advance payment must be a valid positive number' }
  }

  if (advanceAmount > salary) {
    return { error: 'Advance payment cannot be greater than salary per event' }
  }

  let selectedEvent = null
  let selectedBooking = null

  if (assignedBookingId) {
    selectedBooking = await Booking.findById(assignedBookingId).populate('event')
    if (!selectedBooking) return { error: 'Assigned event not found', statusCode: 404 }
    selectedEvent = selectedBooking.event
  } else {
    selectedEvent = await Event.findById(assignedEventId)
    if (!selectedEvent) return { error: 'Assigned event not found', statusCode: 404 }
  }

  return {
    payload: {
      name,
      mobileNo,
      address,
      designation: designation || '',
      assignedEvent: selectedEvent._id || selectedEvent,
      assignedEventNameSnapshot: selectedBooking?.eventNameSnapshot || selectedEvent.name,
      assignedBooking: selectedBooking?._id,
      assignedBookingNameSnapshot: selectedBooking ? `${selectedBooking.eventNameSnapshot} booking` : '',
      assignedBookingClientSnapshot: selectedBooking?.clientName || '',
      duties: Array.isArray(duties)
        ? duties.filter(Boolean)
        : String(duties || '')
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
      dutyNotes: dutyNotes || '',
      totalSalary: salary,
      paymentStatus: safePaymentStatus,
      advancePayment: advanceAmount,
    },
  }
}

router.get('/admin/staff', protect, async (_req, res) => {
  try {
    const staff = await Staff.find().populate('assignedEvent').populate('assignedBooking').sort({ createdAt: -1 })
    res.json(staff)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/admin/staff/:id', protect, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('assignedEvent').populate('assignedBooking')
    if (!staff) return res.status(404).json({ message: 'Staff not found' })
    res.json(staff)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/admin/staff', protect, async (req, res) => {
  try {
    const { payload, error, statusCode } = await buildStaffPayload(req.body)
    if (error) return res.status(statusCode || 400).json({ message: error })

    const staff = await Staff.create(payload)
    await staff.populate('assignedEvent')
    await staff.populate('assignedBooking')
    res.status(201).json(staff)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/admin/staff/:id', protect, async (req, res) => {
  try {
    const { payload, error, statusCode } = await buildStaffPayload(req.body)
    if (error) return res.status(statusCode || 400).json({ message: error })

    const staff = await Staff.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).populate('assignedEvent').populate('assignedBooking')
    if (!staff) return res.status(404).json({ message: 'Staff not found' })
    res.json(staff)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/admin/staff/:id', protect, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id)
    if (!staff) return res.status(404).json({ message: 'Staff not found' })
    res.json({ message: 'Staff deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
