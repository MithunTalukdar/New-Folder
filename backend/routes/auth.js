import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ ok: false, msg: 'Email taken' })
    }

    const hash = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: hash })

    res.json({ ok: true, msg: 'Account created' })
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ ok: false, msg: 'Wrong email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ ok: false, msg: 'Wrong email or password' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      ok: true,
      msg: 'Login done',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    })
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Server error' })
  }
})

export default router
