const express = require('express')
const Event = require('../models/Event')
const protect = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const router = express.Router()

function parseBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value
  if (value === undefined || value === null || value === '') return fallback
  return value === 'true'
}

function parsePackages(value) {
  if (!value) return []

  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((pkg) => pkg.name && pkg.price !== undefined && pkg.price !== '')
      .map((pkg) => ({
        name: String(pkg.name).trim(),
        price: Number(pkg.price),
        description: pkg.description || '',
        includes: Array.isArray(pkg.includes)
          ? pkg.includes.filter(Boolean).map((item) => String(item).trim())
          : String(pkg.includes || '')
              .split('\n')
              .map((item) => item.trim())
              .filter(Boolean),
        featured: parseBoolean(pkg.featured),
      }))
  } catch (_error) {
    return []
  }
}

function mapPublicEvent(event) {
  return {
    id: event._id,
    _id: event._id,
    name: event.name,
    category: event.category,
    shortSummary: event.shortSummary || '',
    description: event.description,
    price: event.price,
    priceLabel: `Starting from ₹${Number(event.price || 0).toLocaleString('en-IN')}`,
    image: event.imageUrl,
    imageUrl: event.imageUrl,
    featured: event.featured,
    isActive: event.isActive,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }
}

function mapAdminEvent(event) {
  return {
    ...mapPublicEvent(event),
    packages: event.packages || [],
  }
}

function buildEventPayload(body, file, existingEvent) {
  const packages = parsePackages(body.packages)
  const price = Number(body.price)

  return {
    name: body.name,
    category: body.category,
    shortSummary: body.shortSummary || '',
    description: body.description,
    price,
    packages,
    imageUrl: file ? `/uploads/events/${file.filename}` : existingEvent?.imageUrl || '',
    featured: parseBoolean(body.featured),
    isActive: parseBoolean(body.isActive, true),
  }
}

function validateEventPayload(payload) {
  if (!payload.name || !payload.category || !payload.description || Number.isNaN(payload.price)) {
    return 'Name, category, description and price are required'
  }

  if (payload.price < 0) {
    return 'Price cannot be negative'
  }

  const invalidPackage = payload.packages.find((pkg) => Number.isNaN(pkg.price) || pkg.price < 0)
  if (invalidPackage) {
    return 'Package prices must be valid positive numbers'
  }

  return ''
}

router.get('/events', async (_req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ createdAt: -1 })
    res.json(events.map(mapPublicEvent))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/events/featured', async (_req, res) => {
  try {
    const events = await Event.find({ featured: true }).sort({ createdAt: -1 }).limit(3)
    res.json(events.map(mapPublicEvent))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/events/contact-options', async (_req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 })
    res.json(events.map(mapPublicEvent))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event || !event.isActive) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json(mapPublicEvent(event))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/admin/events', protect, async (_req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 })
    res.json(events.map(mapAdminEvent))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/admin/events/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(mapAdminEvent(event))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/admin/events', protect, upload.single('image'), async (req, res) => {
  try {
    const payload = buildEventPayload(req.body, req.file)
    const validationError = validateEventPayload(payload)
    if (validationError) return res.status(400).json({ message: validationError })

    const event = await Event.create(payload)
    res.status(201).json(mapAdminEvent(event))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/admin/events/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const existingEvent = await Event.findById(req.params.id)
    if (!existingEvent) return res.status(404).json({ message: 'Event not found' })

    const payload = buildEventPayload(req.body, req.file, existingEvent)
    const validationError = validateEventPayload(payload)
    if (validationError) return res.status(400).json({ message: validationError })

    const event = await Event.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
    res.json(mapAdminEvent(event))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/admin/events/:id', protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
