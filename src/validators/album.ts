import { z } from "zod";

export const getAlbumValidator = z.object({
  id: z.string(),
});

export type GetAlbumValidator = z.infer<typeof getAlbumValidator>;

export const createAlbumValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Album name must be longer than 3 characters" }),
  description: z.string().nullable(),
});

export type CreateAlbumValidator = z.infer<typeof createAlbumValidator>;

export const deleteAlbumValidator = z.object({
  id: z.string(),
});

export type DeleteAlbumValidator = z.infer<typeof deleteAlbumValidator>;
