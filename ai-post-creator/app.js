import { ExpressAuth } from "@auth/express";
import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {serve} from "inngest/express"
import { configDotenv } from "dotenv";

import authRoutes from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import { inngest } from "./inngest/client.js";
import { onUserSignupComplete, onUserSigningUp } from "./inngest/functions/on-signup.js";
import { onPostCreated } from "./inngest/functions/on-post-create.js";

const app = e();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(e.json());
app.use(cookieParser());
app.use("/auth/*", ExpressAuth({ providers: [] }))

app.use("/api/auth", authRoutes);
app.use("/api/post", postRouter)

app.use("/api/inngest", serve({
    client: inngest,
    functions: [onUserSigningUp, onUserSignupComplete, onPostCreated]
})
)

export default app;
