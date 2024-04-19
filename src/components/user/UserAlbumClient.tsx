import { FC } from "react";
import AlbumComponent from "./UserAlbumComponent";
import { ExtendedAlbum } from "../../types/prisma";

interface UserAlbumClientProps {
  
  albums: ExtendedAlbum[];
  isSelf: boolean;
}

const UserAlbumClient: FC<UserAlbumClientProps> = ({ albums, isSelf }) => {
  return (
    <>
      {albums.map((album) => {
        return <AlbumComponent key={album.id} album={album} isSelf={isSelf} />;
      })}
    </>
  );
};

export default UserAlbumClient;
