"use client";

import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Album, Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useEdgeStore } from "@/utils/edgestore";
import { toast } from "sonner";
import { Button } from "./ui/button";

const AlertDialogComponent = React.forwardRef(
  (
    {
      album,
      photo,
    }: {
      album?: Album & {
        Post: Post[];
      };
      photo?: Post;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { loginToast } = useCustomToast();
    const router = useRouter();
    const { edgestore } = useEdgeStore();
    let desc = "";
    if (album) desc = "album";
    if (photo) desc = "photo";
    const handleClick = async () => {
      let payload: {
        id: string;
        userId: string | null;
      } = {
        id: "",
        userId: null,
      };

      let res;

      if (album) {
        payload["id"] = album.id;
        payload["user_id"] = album.user_id;

        for (const photo of album.Post) {
          await edgestore.myPublicImages.delete({
            url: photo?.image!,
          });
        }

        res = await fetch(`/api/album`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (photo) {
        payload["id"] = photo.id;
        payload["user_id"] = photo.user_id;

        await edgestore.myPublicImages.delete({
          url: photo?.image!,
        });

        res = await fetch(`/api/album/photo`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = new Response("Not deleted anything");
      }

      if (!res.ok) {
        if (res.status === 401) {
          return loginToast();
        } else {
          return toast.error(`Your ${desc} cannot be deleted at the time, please try again`);
        }
      }
      router.refresh();

      return toast.success(`Has been deleted ${desc}`);

    };

    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <div className="w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
            Delete {desc}
          </div>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialog.Content
            className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
            ref={ref}
          >
            <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Are you absolutely sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
              This action cannot be undone. This will delete all the posts and
              photos that are in the album
            </AlertDialog.Description>
            <div className="flex justify-end gap-[25px]">
              <AlertDialog.Cancel asChild>
                <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button onClick={() => handleClick()}>
                  Yes, delete {desc}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    );
  }
);

export default AlertDialogComponent;
