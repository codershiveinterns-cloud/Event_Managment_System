const express = require('express')
const Booking = require('../models/Booking')
const Event = require('../models/Event')
const protect = require('../middleware/authMiddleware')
const { calculateInclusiveDays } = require('../utils/date')

const router = express.Router()

function calculateStatus(fromDate, toDate, requestedStatus) {
  if (requestedStatus && ['upcoming', 'current', 'passed'].includes(requestedStatus)) return requestedStatus

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const from = new Date(fromDate)
  const to = new Date(toDate)
  from.setHours(0, 0, 0, 0)
  to.setHours(0, 0, 0, 0)

  if (today < from) return 'upcoming'
  if (today > to) return 'passed'
  return 'current'
}

async function buildBookingPayload(body) {
  const { clientName, mobileNo, address, eventId, fromDate, toDate, price, totalBudget: requestedTotalBudget, downPayment, status, notes } = body
  const directTotalBudget = requestedTotalBudget ?? price

  if (!clientName || !mobileNo || !address || !eventId || !fromDate || !toDate || directTotalBudget === undefined || directTotalBudget === '') {
    return { error: 'Client, mobile, address, event, dates and total budget are required' }
  }

  const selectedEvent = await Event.findById(eventId)
  if (!selectedEvent) return { error: 'Selected event not found', statusCode: 404 }

  const numberOfDays = calculateInclusiveDays(fromDate, toDate)
  if (numberOfDays < 1) return { error: 'To date must be after or same as from date' }

  const totalBudget = Number(directTotalBudget)
  const bookingDownPayment = Number(downPayment || 0)
  const totalPrice = totalBudget
  const balanceDue = totalPrice - bookingDownPayment

  if (Number.isNaN(totalBudget) || totalBudget < 0) return { error: 'Total budget must be a valid positive number' }
  if (Number.isNaN(bookingDownPayment) || bookingDownPayment < 0) return { error: 'Downpayment must be a valid positive number' }
  if (bookingDownPayment > totalPrice) return { error: 'Downpayment cannot be greater than total budget' }

  return {
    payload: {
      clientName,
      mobileNo,
      address,
      event: selectedEvent._id,
      eventNameSnapshot: selectedEvent.name,
      packageNameSnapshot: '',
      packagePriceSnapshot: 0,
      fromDate,
      toDate,
      numberOfDays,
      price: totalBudget,
      totalBudget,
      downPayment: bookingDownPayment,
      totalPrice,
      balanceDue,
      status: calculateStatus(fromDate, toDate, status),
      notes: notes || '',
    },
  }
}

router.get('/admin/bookings', protect, async (req, res) => {
  try {
    const query = req.query.status ? { status: req.query.status } : {}
    const bookings = await Booking.find(query).populate('event').sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/admin/bookings/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/admin/bookings', protect, async (req, res) => {
  try {
    const { payload, error, statusCode } = await buildBookingPayload(req.body)
    if (error) return res.status(statusCode || 400).json({ message: error })

    const booking = await Booking.create(payload)
    await booking.populate('event')
    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/admin/bookings/:id', protect, async (req, res) => {
  try {
    const { payload, error, statusCode } = await buildBookingPayload(req.body)
    if (error) return res.status(statusCode || 400).json({ message: error })

    const booking = await Booking.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).populate('event')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/admin/bookings/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
