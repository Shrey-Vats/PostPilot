import {z} from "zod"

export const createPostSchema = z.object({
  dayNumber: z.number().min(1).optional(),
  progressSummary: z.string(),
  postGoal: z
    .enum(["Inspire", "Teach", "Update", "Promote", "Engage", "question"])
    .optional(),
  targetPlatforms: z.array(z.enum(["X", "Lindkin", "Threads"])).optional(),
  audienceType: z.string().optional(),
  tone: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
});