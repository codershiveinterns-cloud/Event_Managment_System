const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNo: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      default: '',
      trim: true,
    },
    assignedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    assignedEventNameSnapshot: {
      type: String,
      required: true,
    },
    assignedBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    assignedBookingNameSnapshot: {
      type: String,
      default: '',
      trim: true,
    },
    assignedBookingClientSnapshot: {
      type: String,
      default: '',
      trim: true,
    },
    duties: {
      type: [String],
      default: [],
    },
    dutyNotes: {
      type: String,
      default: '',
      trim: true,
    },
    totalSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'advance', 'paid'],
      default: 'pending',
    },
    advancePayment: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Staff', staffSchema)
