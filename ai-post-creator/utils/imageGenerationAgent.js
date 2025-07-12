import { GoogleGenerativeAI } from "@google/generative-ai";
import Post from "../models/post.js";

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const genrateImageFromPost = async (post) => {
  if (!post.imagePrompt || post.imagePrompt.length < 10) {
    throw new Error("❌ Invalid or missing imagePrompt in post object");
  }

  try {
    await Post.findByIdAndUpdate(post._id, {
      imageStatus: "generating",
    });

    const model = geminiClient.getGenerativeModel({
      model: "models/gemini-1.5-pro",
    });

    const result = await model.generateContent([
      {
        text: `Generate a high quality, visually appealing image based on this prompt: "${post.imagePrompt}". Return only the base64 image.`,
      },
    ]);

    const response = await result.response;
    const text = await response.text();

    // Optional: You may need to parse or clean `text` if it includes markdown or extra formatting.
    // Example: extract base64 if wrapped in markdown like ![image](data:image/png;base64,...)
    const base64Match = text.match(/data:image\/[a-z]+;base64,[^\s)"]+/i);
    const imageBase64 = base64Match ? base64Match[0] : null;

    if (!imageBase64) {
      throw new Error(
        "❌ Gemini API did not return a valid base64 image string."
      );
    }

    await Post.findByIdAndUpdate(post._id, {
      imageStatus: "generated",
    });

    return {
      imagePrompt: post.imagePrompt,
      imageBase64, // you may convert or upload this to get a URL
    };
  } catch (error) {
    await Post.findByIdAndUpdate(post._id, {
      imageStatus: "failed",
    });

    console.error("❌ Error generating image:", error.message);
    throw error;
  }
};

export { genrateImageFromPost };
