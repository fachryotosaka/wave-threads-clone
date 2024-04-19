"use client";
import { PlusIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import CreateAlbum from "./CreateAlbum";
import { Album, Post } from "@prisma/client";
import { ExtendedAlbum } from "../types/prisma";
import Image from "next/image";
import { buttonVariants } from "./common/Button";

type Props = {
  albums: ExtendedAlbum[];
};

const SelectAlbumButton = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [open, setOpen] = useState(false);
  const albumSelected = searchParams.get("album");

  function handleAlbumSelect(albumName: string, albumId: string) {
    setSelectedAlbum(albumName);
    updateUrl(albumId, true);
  }

  useEffect(() => {
    if (albumSelected) {
      setOpen(false);
      const albumName = props.albums.find(
        (album) => album.id === albumSelected
      );
      if (albumName) {
        setSelectedAlbum(albumName?.name);
      } else {
        setSelectedAlbum("");
        updateUrl("", false);
      }
    }
  }, [albumSelected]);

  function updateUrl(albumName: string, isAdd: boolean) {
    const params = new URLSearchParams(searchParams);
    if (isAdd === true) {
      params.set("album", albumName);
    } else {
      params.delete("album");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={buttonVariants({
            size: "xs",
            className: "text-center inline-flex items-center",
          })}
        >
          {selectedAlbum === "" && (
            <PlusIcon className="w-3 h-3 text-white me-1" />
          )}
          {selectedAlbum !== "" ? selectedAlbum : "Album"}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Select album</DialogTitle>
          <CreateAlbum>
            <div className="h-24 w-96 flex justify-center items-center border border-black/15 mt-2 rounded-md hover:bg-slate-100">
              <PlusIcon className="w-4 h-4 me-1" />
              Create new album
            </div>
          </CreateAlbum>
          <ul className="flex justify-center items-center flex-col">
            {props.albums.map((album) => (
              <DialogClose key={album.id}>
                <li
                  className="h-24 w-96 flex justify-start items-end border border-black/15 mt-2 rounded-md hover:bg-slate-100 relative"
                  onClick={() => handleAlbumSelect(album.name, album.id)}
                >
                  {album.Post[0] && (
                    <Image
                      src={album.Post[0].image!}
                      alt={album.Post[0].content ?? ""}
                      width={0}
                      height={0}
                      sizes="100vw  "
                      className="w-full h-full object-cover absolute"
                    />
                  )}
                  <div className="flex flex-col justify-start items-start z-10 bg-[#00000099] rounded-md px-2 pb-1">
                    <h3 className="font-semibold text-[15px] mt-1 text-white">
                      {album.name}
                    </h3>
                    <p className="font-normal text-[13px] text-white">
                      {album.Post.length === 0
                        ? "Empty"
                        : `${album.Post.length} item`}
                    </p>
                  </div>
                </li>
              </DialogClose>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectAlbumButton;
