import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

function guard(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, msg: 'No token' })
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    return res.status(401).json({ ok: false, msg: 'Bad token' })
  }
}

router.get('/', guard, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'Not found' })
    }
    res.json({ ok: true, user })
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Server error' })
  }
})

router.put('/', guard, async (req, res) => {
  try {
    const { name, email, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ ok: false, msg: 'Not found' })
    }
    res.json({ ok: true, user })
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Server error' })
  }
})

export default router
