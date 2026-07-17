const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

function createToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET || 'dev-secret-change-me', {
    expiresIn: '7d',
  })
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists with this email' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const admin = await Admin.create({ name, email, passwordHash })

    res.status(201).json({
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token: createToken(admin._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    await Admin.findOne({ email: normalizedEmail })

    res.json({
      message: 'If an admin account exists for this email, a password reset request has been received. Please contact the site owner to complete the reset.',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token: createToken(admin._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/me', protect, (req, res) => {
  res.json({ admin: req.admin })
})

router.put('/me', protect, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()

    if (!trimmedName || !normalizedEmail) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    const admin = await Admin.findById(req.admin._id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const existingAdmin = await Admin.findOne({ email: normalizedEmail })
    if (existingAdmin && existingAdmin._id.toString() !== admin._id.toString()) {
      return res.status(409).json({ message: 'Another admin already uses this email' })
    }

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required to change password' })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' })
      }

      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash)
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' })
      }

      admin.passwordHash = await bcrypt.hash(newPassword, 10)
    }

    admin.name = trimmedName
    admin.email = normalizedEmail
    await admin.save()

    res.json({
      admin: { id: admin._id, name: admin.name, email: admin.email },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out' })
})

module.exports = router
