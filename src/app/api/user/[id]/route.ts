import prisma from "@/DB/db.config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const users = await prisma.user.findUnique({
		where: {
			id: params.id,
		},
		select: {
			id: true,
			name: true,
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
							user_id: params.id!,
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

	return NextResponse.json({ status: 200, data: { ...users, Album: transformedAlbum } });
}
