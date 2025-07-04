import e from 'express'
import { getAllUsers, getUserProfile, Login, Logout, Signup, updateUser } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const userRoutes = e.Router()

userRoutes.post("/signup", Signup)
userRoutes.post("/login", Login)
userRoutes.post("/Logout", Logout);

userRoutes.get("/profile", authMiddleware, getUserProfile)
userRoutes.get("/", authMiddleware, getAllUsers)
userRoutes.put("/update-user", authMiddleware, updateUser )

export default userRoutes