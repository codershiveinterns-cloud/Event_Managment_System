const fs = require('fs/promises')
const path = require('path')
const { put } = require('@vercel/blob')

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase()
}

async function saveToLocalUploads(file, folder, filename) {
  const uploadDir = path.join(__dirname, '..', 'uploads', folder)
  await fs.mkdir(uploadDir, { recursive: true })
  await fs.writeFile(path.join(uploadDir, filename), file.buffer)
  return `/uploads/${folder}/${filename}`
}

async function uploadToBlob(file, folder) {
  if (!file?.buffer) throw new Error('Upload file buffer is missing')

  const safeName = sanitizeFilename(file.originalname)
  const filename = `${Date.now()}-${safeName}`

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return saveToLocalUploads(file, folder, filename)
  }

  const blob = await put(`${folder}/${filename}`, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  })

  return blob.url
}

module.exports = { uploadToBlob }
