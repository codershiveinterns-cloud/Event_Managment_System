const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Gallery', gallerySchema)
