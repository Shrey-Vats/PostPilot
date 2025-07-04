import e from "express";
import cors from 'cors'
import { configDotenv } from "dotenv";
import authRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";

const app = e();

app.use(cors())
app.use(e.json())
app.use(cookieParser());

app.use("/api/users", authRoutes)

export default app