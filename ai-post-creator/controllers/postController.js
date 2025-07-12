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

export const getPosts = async (req, res) => {
  try {
    const user = req.user;
    let posts = [];

    if (user.role !== "user") {
        posts = await Post.find({})
          .populate("assignedTo", ["email", "_id"])
          .sort({ createdAt: -1 });
    } else {
        posts = await Post.find({ createdBy: user._id })
        .select("-assignedTo -createdBy ")
        .sort({createdAt: -1})
    }

    return res.status(200).json({posts})
   
  } catch (error) {
    console.error("error on fetching post", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getPost = async(req, res) => {
    try {
       const user = req.user
       let post;

       if(user.role !== 'user'){
        post = await Post.findById(req.params.id).populate("assignedTo", ["email", "_id"])
       } else {
        post = await Post.findOne({
          createdBy: user._id,
          _id: req.params._id
        })
       }

       if(!post){
        return res.status(404).json({
          message: "Post params not found",
          success: false
        })
       }

        return res.status(200).json({
          post
        })
        
    } catch (error) {
        console.error("error on creatig post", error.message);
        res
          .status(500)
          .json({
            message: "Internal server error",
          })
          .select("-assignedTo -createdBy");
    }
}