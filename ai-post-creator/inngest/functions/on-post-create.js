import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import { sendEmail } from "../../utils/mailer.js";
import Post from "../../models/post.js"
import User from "../../models/user.js";
import analizePost from "../../utils/postWritingAgent.js";
import { genrateImageFromPost } from "../../utils/imageGenerationAgent.js";

export const onPostCreated = inngest.createFunction(
  { id: "on-user-signup-complete", retries: 2 },
  { event: "user/signup-complete" },
  async ({event, step}) => {
    try {
      const {postId} = event.data

      const post = await step.run("get-post", async () => {
        const postObject = await Post.findById(postId);

        if (!postObject) {
          throw new NonRetriableError("post not found !");
        }

        return postObject
      })

      await step.run("update-post-status", async () => {
        await Post.findByIdAndUpdate(post._id, {
          status: "pending_approval",
        });
      })
      
      const aiPostResponse = await analizePost(post)

      const relatedPlatforms = await step.run("ai-post-processing", async () => {
        let targetPlatforms = []
        if(aiPostResponse){
          await Post.findByIdAndUpdate(post._id, {
            imagePrompt: !aiPostResponse.imagePrompt
              ? `genrate a high quality image from this post data ${aiPostResponse.x}`
              : aiPostResponse.imagePrompt,
            imageDetailing: !aiPostResponse.imageDetailing
              ? "medium"
              : aiPostResponse.imageDetailing,
            "platformPosts.X": !aiPostResponse.X 
              ? null 
              : aiPostResponse.X,
            "platformPosts.LinkedIn": !aiPostResponse.LinkedIn
              ? null
              : aiPostResponse.LinkedIn,
            "platformPosts.X": !aiPostResponse.Threads
              ? null
              : aiPostResponse.Threads,
          });
          targetPlatforms = [...targetPlatforms, x, LinkedIn, threads]
        }
      })

      const aiImageResponse = await genrateImageFromPost(post);

      await step.run("ai-image-processing", async () => {
        if(aiImageResponse){
          Post.findByIdAndUpdate(post._id, {
            imageURL: aiImageResponse.imageUrl,
          });
        }
      })

      const moderator = await step.run("assign-moderator", async () => {
        let user = User.findOne({
          role: admin
        })

        await Post.findByIdAndUpdate(post._id, {
          assignedTo: user?.id || null,
        });

        return user
      })

      //here can be send mail or not optional

      return {success: true}

    } catch (err) {
      console.error("❌ error running step", err.message)
      return {success: false}
    }
  }
);