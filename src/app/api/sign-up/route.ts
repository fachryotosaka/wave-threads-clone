import { prisma } from "@/utils/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, email, password, name } = (await req.json()) as {
      name: string;
      username: string;
      email: string;
      password: string;
    };
    const hashed_password = await hash(password, 12);

    try {
      const user = await prisma.user.create({
        data: {
          name: username, 
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashed_password,
        },
      });

      return NextResponse.json({
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error: any) {
      // console.log(error);
      return new NextResponse(
        JSON.stringify({
          code: "Username has been taken",
          message: "Username has been taken, please try again",
        }),
        { status: 500 }
      );
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Unexpected error",
      }),
      { status: 500 }
    );
  }
}
