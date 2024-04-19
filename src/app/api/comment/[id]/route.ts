import { NextRequest, NextResponse } from "next/server";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import prisma from "@/DB/db.config";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ status: 401, message: "Un-Authorized" });
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: params.id,
    },
  });

  if (comment == null || comment.user_id != session.user?.id!) {
    return NextResponse.json({ status: 401, message: "Un-Authorized" });
  }

  await prisma.comment.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({
    status: 200,
    message: "Comment deleted successfully!",
  });
}
