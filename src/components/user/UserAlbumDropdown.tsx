import AlertDialogComponent from "@/components/AlertDialogAlbum";
import CreateAlbum from "@/components/CreateAlbum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Album, Post } from "@prisma/client";
import { Ellipsis } from "lucide-react";

const UserAlbumDropdown = ({
  album,
  Post,
  isSelf,
}: {
  album?: Album & {
    Post: Post[];
  };
  Post?: Post & {
    user_id: string;
    albumId: string | null;
    content: string;
    comment_count: number;
    like_count: number;
    created_at: Date;
  };
  isSelf: boolean;
}) => {
  return (
    isSelf && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute rounded-full w-[28px] h-[28px] flex items-center justify-center text-white bg-black/40 right-0 m-2">
            <Ellipsis size={18} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={5}>
          {Post && (
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <AlertDialogComponent photo={Post} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          {album && (
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <CreateAlbum album={album}>
                  <div className="w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    Edit album
                  </div>
                </CreateAlbum>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AlertDialogComponent album={album} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default UserAlbumDropdown;
