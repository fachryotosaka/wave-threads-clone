import {
  Comment,
  Post,
  User,
  Like,
  Album,
} from "@prisma/client";

export type ExtendedPost = Post & {
  photos: Post[];
  Like: Like[];
  user: User;
  Comment: Comment[];
};

export type ExtendedAlbum = Album & {
  Post: Post[];
};
