import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/options";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

async function createContext({ req }: CreateContextOptions) {
  // get the session from your auth provider
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return {
    userId: user?.id,
    userRole: user?.role,
  };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  myPublicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
    })
    .input(
      z.object({
        type: z.enum(["post", "profile"]),
      })
    )
    .beforeDelete(({ ctx, fileInfo }) => {
      return true; // allow delete
    })
    // e.g. /post/my-file.jpg
    .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es
    .fileBucket()
    // e.g. /123/my-file.pdf
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        {
          userId: { path: "owner" },
        },
        {
          userRole: { eq: "admin" },
        },
      ],
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };

export type EdgeStoreRouter = typeof edgeStoreRouter;
