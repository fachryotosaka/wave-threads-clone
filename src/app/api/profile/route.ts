import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Action to update or edit
export const PUT = async (req: NextRequest) => {
    try {
      const { image, name, id } = await req.json();
  
      let profile;
  
      if (image) {
        // If an image is provided, update the user's profile image
        profile = await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            image: image,
          },
        });
      } else if (name) {
        // If a name is provided, update the user's name
        profile = await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            name: name,
          },
        });
      } else {
        // Handle the case where neither image nor name is provided
        return NextResponse.error();
      }
  
      return NextResponse.json({
        profile,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return NextResponse.error();
    }
  };
