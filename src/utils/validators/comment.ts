import { z } from "zod";

export const CommentValidator = z.object({
  postId: z.string(),
  content: z.string(),
  replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof CommentValidator>;
