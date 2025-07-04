import e from "express";
import cors from 'cors'
import { configDotenv } from "dotenv";

const app = e();

app.use(cors())
app.use(e.json())



export default app