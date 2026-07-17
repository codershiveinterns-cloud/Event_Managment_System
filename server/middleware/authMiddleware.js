const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me')
    const admin = await Admin.findById(decoded.id).select('-passwordHash')

    if (!admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' })
    }

    req.admin = admin
    next()
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token invalid' })
  }
}

module.exports = protect
