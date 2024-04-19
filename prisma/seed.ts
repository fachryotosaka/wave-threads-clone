import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin",
      username: "admin",
      role: Role.admin,
      password,
    },
  });
  const default_album_1 = await prisma.album.upsert({
    where: { id: "default_profile_image_album" },
    update: {},
    create: {
      id: "default_profile_image_album",
      name: "Profile Image",
			user: {
				connect: {
					id: user.id,
				},
			},
    },
  });
  const default_album_2 = await prisma.album.upsert({
    where: { id: "default_banner_image_album" },
    update: {},
    create: {
      id: "default_banner_image_album",
      name: "Banner Image",
			user: {
				connect: {
					id: user.id,
				},
			},
    },
  });
  const default_album_3 = await prisma.album.upsert({
    where: { id: "default_saved_image_album" },
    update: {},
    create: {
      id: "default_saved_image_album",
      name: "Saved Image",
			user: {
				connect: {
					id: user.id,
				},
			},
    },
  });
  console.log({ user, default_album_1, default_album_2, default_album_3 });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
