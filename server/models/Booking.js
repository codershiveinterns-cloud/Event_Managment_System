const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
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
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    eventNameSnapshot: {
      type: String,
      required: true,
    },
    packageNameSnapshot: {
      type: String,
      default: '',
    },
    packagePriceSnapshot: {
      type: Number,
      default: 0,
      min: 0,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
    downPayment: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'current', 'passed'],
      default: 'upcoming',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Booking', bookingSchema)
