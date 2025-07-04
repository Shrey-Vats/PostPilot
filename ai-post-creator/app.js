import e from "express";
import cors from 'cors'
import { configDotenv } from "dotenv";
import authRoutes from "./routes/authRoutes";

const app = e();

app.use(cors())
app.use(e.json())

app.use("/api/", authRoutes)

export default app