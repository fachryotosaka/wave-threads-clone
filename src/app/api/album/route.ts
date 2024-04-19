import { prisma } from "@/utils/prisma";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/options";
import { type GetAlbumValidator, createAlbumValidator, deleteAlbumValidator, getAlbumValidator } from "@/validators/album";
import { z } from "zod";
import { type NextRequest, NextResponse } from "next/server";
import { searchParamsToObject } from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse<AlbumType>> {
  const session = await getAuthSession();

  if (!session?.user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  let payload: GetAlbumValidator;
  try {
    payload = await getAlbumValidator.parseAsync(searchParamsToObject(req.nextUrl.searchParams));
  } catch (e) {
    return new NextResponse("Invalid request data passed", { status: 400 });
  }

  const album = await prisma.album.findUnique({
    where: {
      id: payload.id,
      user_id: session.user.id,
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

  if (!album) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { Post: posts, ...rest } = album;

  // transform albums to be compatible with AlbumType
  const transformedAlbum = {
    ...rest,
    description: rest.description ?? "",
    posts: posts.map((p) => ({
      ...p,
      image: p.image ?? "",
    })),
  }

  return NextResponse.json(transformedAlbum)
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { name, description } = createAlbumValidator.parse(body);

    const album = await prisma.album.create({
      data: {
        user_id: session.user.id,
        name,
        description,
      },
    });

    return new Response(JSON.stringify(album));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response(
      "Could not post to breadit at this time, please try again later.",
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { id } = await deleteAlbumValidator.parseAsync(body);

    if (id === "default_banner_image_album" || id === "default_profile_image_album" || id === "default_saved_image_album") {
      return new Response("Cannot delete default album", { status: 403 });
    }

    await prisma.album.delete({
      where: {
        id: id,
        user_id: session.user.id,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response(
      "Could not post to breadit at this time, please try again later.",
      { status: 500 }
    );
  }
}
