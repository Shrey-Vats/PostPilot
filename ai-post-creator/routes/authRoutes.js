import e from 'express'
import { Login, profile, Signup } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const authRoutes = e.Router()

authRoutes.post("/signup", Signup)
authRoutes.post("/login", Login)

authRoutes.get("/me", authMiddleware , profile )

export default authRoutes