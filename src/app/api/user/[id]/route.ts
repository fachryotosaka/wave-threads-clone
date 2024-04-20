import prisma from "@/DB/db.config";
import { NextRequest, NextResponse } from "next/server";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

// export async function GET(
// 	request: NextRequest,
// 	{ params }: { params: { id: string } },
	
// ) {
	
// 	const users = await prisma.user.findUnique({
		
// 		where: {
// 			id: params.id,
// 		},
// 		select: {
// 			id: true,
// 			name: true,
// 			email: true,
// 			username: true,
// 			image: true,

// 			Post: {
// 				include: {
// 					user: {
// 						select: {
// 							id: true,
// 							name: true,
// 							email: true,
// 						},
// 					},
// 					Likes: {
// 						where: {
// 							user_id: params.id!,
// 						},
// 					},
// 				},
// 			},
// 			Comment: {
// 				include: {
// 					user: {
// 						select: {
// 							id: true,
// 							name: true,
// 							email: true,
// 						},
// 					},
// 				},
// 			},
// 			Album: {
// 				include: {
// 					Post: {
// 						select: {
// 							id: true,
// 							image: true
// 						},
// 					},
// 				},
// 			},
// 		},
// 	});

// 	const session: CustomSession | null = await getServerSession(authOptions);
// 	if (!session) {
// 		return NextResponse.json({ status: 401, message: "Un-Authorized" });
// 	}

// 	const albums = await prisma.album.findMany({
// 		where: {
// 		  user_id: session.user?.id!,
// 		},
// 		include: {
// 		  Post: {
// 			select: {
// 			  id: true,
// 			  image: true
// 			}
// 		  }
// 		},
// 	  });

// 	  // transform albums to be compatible with AlbumType
// 	  const transformedAlbums = albums.map(({ Post: posts, ...album }) => ({
// 		...album,
// 		description: album.description ?? "",
// 		posts: posts.map((p) => ({
// 		  ...p,
// 		  image: p.image ?? "",
// 		}))
// 	  }))

// 	return NextResponse.json({ status: 200, data: users, Album: transformedAlbums  });
// }

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const users = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      name: true,
      id: true,
      email: true,
      username: true,
      image: true,

      Post: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          Likes: {
            where: {
              user_id: params.id,
            },
          },
        },
      },
      Comment: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
	  Album: {
		include: {
			Post: {
				select: {
					id: true,
					image: true
				},
			},
		},
	},
    },
  });

  const albums = await prisma.album.findMany({
	  where: {
		user_id: params.id!,
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

  return NextResponse.json({ status: 200, data: users, Albums: transformedAlbums  });
}

