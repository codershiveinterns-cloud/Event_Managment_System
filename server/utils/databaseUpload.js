const { Readable } = require('stream')
const mongoose = require('mongoose')

const bucketName = 'uploads'

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase()
}

function getBucket() {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    throw new Error('MongoDB is not connected')
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName })
}

async function uploadToDatabase(file, folder) {
  if (!file?.buffer) throw new Error('Upload file buffer is missing')

  const bucket = getBucket()
  const safeName = sanitizeFilename(file.originalname)
  const filename = `${folder}/${Date.now()}-${safeName}`

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        folder,
        originalName: file.originalname,
      },
    })

    uploadStream.on('error', reject)
    uploadStream.on('finish', () => resolve(`/api/uploads/${uploadStream.id.toString()}`))

    Readable.from(file.buffer).pipe(uploadStream)
  })
}

function getUploadObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  return new mongoose.Types.ObjectId(id)
}

async function findUploadFile(id) {
  const objectId = getUploadObjectId(id)
  if (!objectId) return null

  return getBucket().find({ _id: objectId }).next()
}

function openUploadDownloadStream(id) {
  const objectId = getUploadObjectId(id)
  if (!objectId) throw new Error('Invalid upload id')

  return getBucket().openDownloadStream(objectId)
}

module.exports = { findUploadFile, openUploadDownloadStream, uploadToDatabase }
