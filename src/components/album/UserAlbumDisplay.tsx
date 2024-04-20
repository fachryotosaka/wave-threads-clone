"use client";

import { create } from "zustand";
import AlbumCard from "../common/AlbumCard";
import { MoveLeft, PlusIcon, Trash2 } from "lucide-react";
import CreateAlbumCard from "./CreateAlbumCard";
import { Button } from "../ui/button";
import { ADD_THREAD_SEARCH_PARAM_ALBUM_ID } from "../threads/AddThread";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useStore = create<{
  openedAlbum?: AlbumType;
  openAlbum: (album: AlbumType) => void;
  closeAlbum: () => void;
}>((set) => ({
  openedAlbum: undefined,
  openAlbum: (album) => set({ openedAlbum: album }),
  closeAlbum: () => set({ openedAlbum: undefined }),
}));

const useOpenAlbum = () => useStore((state) => state.openAlbum);
const useCloseAlbum = () => useStore((state) => state.closeAlbum);
const useOpenedAlbum = () => useStore((state) => state.openedAlbum);

export default function UserAlbumDisplay({ albums }: { albums: AlbumType[] }) {
  return (
    <div className="mt-5">
      {albums ? (
        <AlbumNester albums={albums} />
      ) : (
        <h1 className="text-center mt-5">No Album found</h1>
      )}
    </div>
  );
}

const truncateString = (str: string, max: number): string =>
  str.length > 10 ? `${str.substring(0, max)}...` : str;

const defaultAlbums = [
  "default_banner_image_album",
  "default_profile_image_album",
  "default_saved_image_album",
];

function AlbumNester({ albums }: { albums: AlbumType[] }) {
  const openedAlbum = useOpenedAlbum();
  const openAlbum = useOpenAlbum();
  const closeAlbum = useCloseAlbum();

  if (openedAlbum) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <div
            className="flex flex-row gap-3 cursor-pointer p-2 rounded-md text-muted-foreground hover:opacity-80 hover:bg-muted transition-all w-64"
            onClick={() => closeAlbum()}
            onKeyUp={(e) => e.key === "Enter" && closeAlbum()}
          >
            <MoveLeft tabIndex={0} />
            Album "{openedAlbum.name}"
          </div>

          {!defaultAlbums.includes(openedAlbum.id) && (
            <AlbumDeleteButton
              album={{ name: openedAlbum.name, id: openedAlbum.id }}
            />
          )}
        </div>
        {openedAlbum.posts.length === 0 ? (
          <div className="flex flex-col gap-5 items-center">
            <h1 className="text-center mt-5">No posts found</h1>
            <Button variant="outline" className="w-48" asChild>
              <Link
                href={`/?${new URLSearchParams({
                  [ADD_THREAD_SEARCH_PARAM_ALBUM_ID]: openedAlbum.id,
                })}`}
              >
                Create a new post
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            <Link
              href={`/?${new URLSearchParams({ albumId: openedAlbum.id })}`}
            >
              <article className="flex flex-col justify-center h-full items-center gap-4 p-3 rounded-md text-muted-foreground hover:opacity-95 hover:bg-muted cursor-pointer transition-all">
                <PlusIcon />
                <p>Create Post</p>
              </article>
            </Link>
            {openedAlbum.posts.map((post) => (
              <AlbumCard
                key={post.id}
                image={post.image}
                href={`/post/${post.id}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <CreateAlbumCard />
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          onClick={() => openAlbum(album)}
          metadata={{
            name: album.name,
            description: truncateString(album.description, 10),
          }}
          image={album.posts[0]?.image}
        />
      ))}
    </div>
  );
}

function AlbumDeleteButton({ album }: { album: { name: string; id: string } }) {
  const closeAlbum = useCloseAlbum();
  const { refresh } = useRouter();
  const { mutate } = useMutation({
    mutationFn: () =>
      fetch("/api/album", {
        method: "DELETE",
        body: JSON.stringify({ id: album.id }),
      }),
    onSuccess: () => {
      closeAlbum();
      refresh();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost" className="p-2 aspect-square group">
          <Trash2 size={18} className="text-red-500 group-hover:text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>Confirmation</AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure to delete the album{" "}
          <span className="text-red-500 font-semibold">"{album.name}"</span>?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              mutate();
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
