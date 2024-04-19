import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/DB/db.config";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/options";

export async function GET(_request: NextRequest): Promise<NextResponse<{ status: 200, data: AlbumType[] } | { status: 401; message: string; }>> {
  const session: CustomSession | null = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ status: 401, message: "Un-Authorized" });
  }

  const albums = await prisma.album.findMany({
    where: {
      user_id: session.user?.id!,
    },
    include: {
      Post: {
        select: {
          id: true,
          image: true
        }
      }
    },
  });

  // transform albums to be compatible with AlbumType
  const transformedAlbums = albums.map(({ Post: posts, ...album }) => ({
    ...album,
    description: album.description ?? "",
    posts: posts.map((p) => ({
      ...p,
      image: p.image ?? "",
    }))
  }))

  return NextResponse.json({ status: 200, data: transformedAlbums });
}
