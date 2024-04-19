// Lokasi file: utils/server.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createAlbum(userId: string, name: string, description: string) {
  try {
    const album = await prisma.album.create({
      data: {
        user: { connect: { id: userId } },
        name,
        description,
      },
    });

    return { status: 200, message: "Album berhasil dibuat", album };
  } catch (error) {
    console.error("Gagal membuat album:", error);
    return { status: 400, message: "Gagal membuat album" };
  }
}

export { prisma };
