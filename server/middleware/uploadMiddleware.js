const fs = require('fs')
const path = require('path')
const multer = require('multer')

const uploadDir = path.join(__dirname, '..', 'uploads', 'events')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase()
    cb(null, `${Date.now()}-${safeName}`)
  },
})

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
    return
  }

  cb(new Error('Only image uploads are allowed'))
}

module.exports = multer({ storage, fileFilter })
