const mongoose = require('mongoose')

let connectionPromise = null

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-management-system'

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri)
  }

  try {
    await connectionPromise
    console.log('MongoDB connected')
    return mongoose.connection
  } catch (error) {
    connectionPromise = null
    console.error('MongoDB connection failed:', error.message)
    console.error('Set MONGO_URI in .env or start local MongoDB on mongodb://127.0.0.1:27017')
    throw error
  }
}

module.exports = connectDB
