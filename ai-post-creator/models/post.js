// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dayNumber: {
      type: Number,
      default: 1, // for Devvolution: "Day 24"
    },

    progressSummary: {
      type: String,
      required: true,
    },

    postGoal: {
      type: String, // e.g. 'Teach', 'Update'
      enum: ["Inspire", "Teach", "Update", "Promote", "Engage"],
      default: "Update",
    },

    targetPlatforms: {
      type: [String], // ['X', 'LinkedIn']
      default: [],
    },

    audienceType: {
      type: String, // 'Devs', 'Beginners', etc.
      default: "Devs",
    },

    tone: {
      type: String,
      default: "Builder",
    },

    hashtags: {
      type: [String], // e.g. ['#DevLogs', '#MERN']
      default: [],
    },

    imagePrompt: {
      type: String,
      default: "",
    },

    imageURL: {
      type: String,
      default: "",
    },

    platformPosts: {
      X: {
        type: String,
        default: "",
      },
      LinkedIn: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "posted"],
      default: "draft",
    },

    ctaIntent: {
      type: String, // e.g., 'Ask for feedback'
      default: "",
    },

    visualPreference: {
      type: String, // e.g., 'Dark theme, code, desk'
      default: "",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0, // user can rate the AI-generated result
    },

    notes: {
      type: String, // Any manual user note or tweak
      default: "",
    },

    createdAt : {type: Date, default: Date.now}
  }
);

export default mongoose.model("Post", postSchema);
