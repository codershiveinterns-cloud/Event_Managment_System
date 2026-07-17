const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require('multer')
const Gallery = require('../models/Gallery')
const protect = require('../middleware/authMiddleware')

const router = express.Router()
const uploadDir = path.join(__dirname, '..', 'uploads', 'gallery')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase()
    cb(null, `${Date.now()}-${safeName}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
      return
    }
    cb(new Error('Only image or video uploads are allowed'))
  },
})

function getUploadedFile(req) {
  return req.files?.media?.[0] || req.files?.image?.[0]
}

function getMediaType(file) {
  return file?.mimetype?.startsWith('video/') ? 'video' : 'image'
}

function mapGallery(item) {
  const mediaUrl = item.mediaUrl || item.imageUrl
  return {
    id: item._id,
    _id: item._id,
    title: item.title,
    category: item.category,
    src: mediaUrl,
    mediaUrl,
    imageUrl: item.imageUrl,
    mediaType: item.mediaType || 'image',
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

const mediaUpload = upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'image', maxCount: 1 },
])

router.get('/gallery', async (_req, res) => {
  try {
    const gallery = await Gallery.find({ isActive: true }).sort({ createdAt: -1 })
    res.json(gallery.map(mapGallery))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/admin/gallery', protect, async (_req, res) => {
  try {
    const gallery = await Gallery.find({ isActive: true }).sort({ createdAt: -1 })
    res.json(gallery.map(mapGallery))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/admin/gallery', protect, mediaUpload, async (req, res) => {
  try {
    const { title, category } = req.body
    const file = getUploadedFile(req)

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' })
    }

    if (!file) {
      return res.status(400).json({ message: 'Gallery media is required' })
    }

    const mediaType = getMediaType(file)
    const mediaUrl = `/uploads/gallery/${file.filename}`
    const item = await Gallery.create({
      title,
      category,
      imageUrl: mediaType === 'image' ? mediaUrl : '',
      mediaUrl,
      mediaType,
      isActive: true,
    })

    res.status(201).json(mapGallery(item))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/admin/gallery/:id', protect, mediaUpload, async (req, res) => {
  try {
    const existing = await Gallery.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Gallery item not found' })

    const { title, category } = req.body
    const file = getUploadedFile(req)
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' })
    }

    existing.title = title
    existing.category = category
    if (file) {
      const mediaType = getMediaType(file)
      const mediaUrl = `/uploads/gallery/${file.filename}`
      existing.mediaUrl = mediaUrl
      existing.mediaType = mediaType
      existing.imageUrl = mediaType === 'image' ? mediaUrl : existing.imageUrl
    }
    await existing.save()

    res.json(mapGallery(existing))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/admin/gallery/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Gallery item not found' })
    res.json({ message: 'Gallery item deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
