require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const staffRoutes = require('./routes/staffRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const galleryRoutes = require('./routes/galleryRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(async (_req, _res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    next(error)
  }
})

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Event management backend is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api', eventRoutes)
app.use('/api', bookingRoutes)
app.use('/api', staffRoutes)
app.use('/api', dashboardRoutes)
app.use('/api', galleryRoutes)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: error.message || 'Server error' })
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

module.exports = app
