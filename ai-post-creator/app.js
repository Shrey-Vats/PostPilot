import { ExpressAuth } from "@auth/express";
import e from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";

const app = e();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(e.json());
app.use(cookieParser());

app.use("/auth/*", ExpressAuth({ providers: [] }))
app.use("/auth", authRoutes);

export default app;
