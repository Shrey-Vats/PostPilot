import { inngest } from "../inngest/client.js";
import Post from "../models/post.js";
import { createPostSchema } from "../validations/postValidation.js";

export const createPostContent = async (req, res) => {
  try {
    const result = createPostSchema.safeParse(req.body)

    if(!result.success){
        res.status(400).json({
            message: "Invalid Crediansals",
            success: false
        })
    }

    const newPost = Post.create({
        createdBy: req.user._id.toString(),
        ...result.data
    })

    await inngest.send({
      name: "user/signup-complete",
      data: {
        postId:(await newPost)._id.toString(),
        ...result.data
      }
    });

    res.status(200).json({
        message: "Ticket created and proccessing started",
        post: newPost
    })


  } catch (error) {
    console.error("error on creatig post", error.message)
    res.status(500).json({
        message: "Internal server error"
    })
  }
}

