import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserAvatar({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  return (
    <Avatar className="">
      {image ? ( // Periksa apakah ada gambar pengguna
        <AvatarImage src={image} className="object-cover" />
      ) : (
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      )}
    </Avatar>
  );
}
