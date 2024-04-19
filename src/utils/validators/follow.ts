import { z } from "zod";

export const userFollowValidator = z.object({
  userId: z.string(),
  followed: z.boolean(),
});

export type UserFollowValidator = z.infer<typeof userFollowValidator>;
