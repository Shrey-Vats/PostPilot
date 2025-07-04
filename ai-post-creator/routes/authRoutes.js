import e from 'express'
import { Login, Signup } from '../controllers/authController.js'

const authRoutes = e.Router()

authRoutes.post("/signup", Signup)
authRoutes.post("/signup", Login)

export default authRoutes