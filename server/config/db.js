const mongoose = require('mongoose')

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-management-system'

  try {
    await mongoose.connect(mongoUri)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    console.error('Set MONGO_URI in .env or start local MongoDB on mongodb://127.0.0.1:27017')
    process.exit(1)
  }
}

module.exports = connectDB
