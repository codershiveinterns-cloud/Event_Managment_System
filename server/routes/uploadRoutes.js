const express = require('express')
const { findUploadFile, openUploadDownloadStream } = require('../utils/databaseUpload')

const router = express.Router()

router.get('/uploads/:id', async (req, res) => {
  try {
    const file = await findUploadFile(req.params.id)
    if (!file) return res.status(404).json({ message: 'Upload not found' })

    res.set('Content-Type', file.contentType || 'application/octet-stream')
    res.set('Cache-Control', 'public, max-age=31536000, immutable')

    openUploadDownloadStream(req.params.id)
      .on('error', () => {
        if (!res.headersSent) res.status(404).json({ message: 'Upload not found' })
      })
      .pipe(res)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
