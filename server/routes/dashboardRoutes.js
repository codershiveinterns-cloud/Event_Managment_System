const express = require('express')
const mongoose = require('mongoose')
const Booking = require('../models/Booking')
const Event = require('../models/Event')
const Staff = require('../models/Staff')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

function sum(items, selector) {
  return items.reduce((total, item) => total + Number(selector(item) || 0), 0)
}

router.get('/admin/dashboard/summary', protect, async (req, res) => {
  try {
    const { bookingId } = req.query
    let events = []
    let bookings = []
    let staff = []

    if (bookingId) {
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking id' })
      }

      const selectedBooking = await Booking.findById(bookingId).populate('event')

      if (!selectedBooking) {
        return res.status(404).json({ message: 'Booking not found' })
      }

      bookings = [selectedBooking]
      events = selectedBooking.event ? [selectedBooking.event] : []
      staff = await Staff.find({ assignedBooking: bookingId })
        .populate('assignedEvent')
        .populate('assignedBooking')
        .sort({ createdAt: -1 })
    } else {
      ;[events, bookings, staff] = await Promise.all([
        Event.find(),
        Booking.find().populate('event').sort({ createdAt: -1 }),
        Staff.find().populate('assignedEvent').populate('assignedBooking').sort({ createdAt: -1 }),
      ])
    }

    const activeEvents = events.filter((event) => event.isActive)
    const totalRevenue = sum(bookings, (booking) => booking.totalBudget ?? booking.price ?? booking.totalPrice)
    const collectedAmount = sum(bookings, (booking) => booking.downPayment)
    const outstandingAmount = sum(bookings, (booking) => (booking.totalBudget ?? booking.price ?? booking.totalPrice) - booking.downPayment)
    const payrollCommitted = sum(staff, (member) => member.totalSalary)
    const totalAmount = totalRevenue
    const advanceAmount = collectedAmount
    const dueAmount = outstandingAmount
    const staffSalaryAmount = payrollCommitted
    const netAmount = totalAmount - staffSalaryAmount

    res.json({
      counts: {
        totalEvents: activeEvents.length,
        inactiveEvents: events.length - activeEvents.length,
        totalStaff: staff.length,
        totalBookings: bookings.length,
        upcomingBookings: bookings.filter((booking) => booking.status === 'upcoming').length,
        currentBookings: bookings.filter((booking) => booking.status === 'current').length,
        passedBookings: bookings.filter((booking) => booking.status === 'passed').length,
      },
      finances: {
        totalAmount,
        advanceAmount,
        dueAmount,
        staffSalaryAmount,
        netAmount,
        totalRevenue: totalAmount,
        collectedAmount: advanceAmount,
        outstandingAmount: dueAmount,
        payrollCommitted: staffSalaryAmount,
        projectedNetBalance: netAmount,
      },
      recentBookings: bookings,
      recentStaff: bookingId ? staff : staff.slice(0, 5),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
