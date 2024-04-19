import z from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters" })
    .max(128, { message: "Title must be at least 128 characters" }),
  userId: z.string(),
  description: z.any(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;

export const postSaveValidator = z.object({
  postId: z.string().nullable().optional(),
  photoId: z.string().nullable().optional(),
  saved: z.boolean(),
});

export type PostSaveValidator = z.infer<typeof postSaveValidator>;
