import Openai, { OpenAI } from "openai"
import Post from '../models/post.js'

const openaiClint = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genrateImageFromPost = async (post) => {
  if(!post.imagePrompt || post.imagePrompt.length < 10){
    throw new Error("❌ Invalid or missing imagePrompt in post object");
  }

  try {
    await Post.findByIdAndUpdate(post._id, {
      imageStatus: "generating",
    });

    const response = await openaiClint.images.generate({
      model: "dall-e-3",
      prompt: post.imagePrompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url

    await Post.findByIdAndUpdate(post._id, {
      imageStatus: "generated",
    });

    return {
      imagePrompt: post.imagePrompt,
      imageUrl,
    };
  } catch (error) {

    await Post.findByIdAndUpdate(post._id, {
      imageStatus: "failed",
    });

    console.error("❌ Error generating image:", error.message);
    throw error;
  }
}

export { genrateImageFromPost };