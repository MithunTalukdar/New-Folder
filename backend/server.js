import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('db connected')
    app.listen(PORT, () => console.log('up on ' + PORT))
  })
  .catch((err) => console.log('db error', err))
