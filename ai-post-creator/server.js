import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config()

const PORT = process.env.PORT || 3000

async function connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("mongoDB connected ✅")

      app.listen(PORT, ()=>{
        console.log("🚀 Server Running on PORT", PORT)
      })
    } catch (error) {
        console.log("mongoDB error 😈", error)
    }
}

connectDB()