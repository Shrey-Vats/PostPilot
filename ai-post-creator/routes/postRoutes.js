import e from "express";

import { createPostContent, getPosts, getPost } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

const postRouter = e.Router()

postRouter.get("/", authMiddleware, getPosts)
postRouter.get("/:id", authMiddleware, getPost)
postRouter.post("/", authMiddleware, createPostContent)

export default postRouter