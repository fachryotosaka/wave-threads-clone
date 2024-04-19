"use client";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@radix-ui/react-label";
import {
  createAlbumValidator,
  CreateAlbumValidator,
} from "@/validators/album";
import { usePathname, useRouter } from "next/navigation";
import { Album } from "@prisma/client";
import { Input } from "./input";
import { Button } from "./common/Button";
import { toast } from "sonner";

const CreateAlbum = forwardRef(
  (
    {
      children,
      album,
    }: {
      children: JSX.Element;
      album?: Album;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const _nameRef = useRef<HTMLInputElement>(null);
    const _descriptionRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<CreateAlbumValidator>({
      resolver: zodResolver(createAlbumValidator),
      defaultValues: {
        name: album?.name ?? "",
        description: album?.description ?? "",
      },
    });

    useEffect(() => {
      if (Object.keys(errors).length) {
        for (const [_key, value] of Object.entries(errors)) {
          toast.error( (value as { message: string }).message);
        }
      }
    }, [errors]);

    const { mutate: createAlbumFn } = useMutation({
      mutationFn: async ({ name, description }: CreateAlbumValidator) => {
        const payload: CreateAlbumValidator = {
          name,
          description,
        };
        setIsLoading(true);
        let res;
        if (!album) {
          res = await fetch("/api/album", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          payload["id"] = album.id;
          res = await fetch("/api/album", {
            method: "PATCH",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        setIsLoading(false);
        if (!res.ok) {
          const resJson = await res.json();
          toast.error(resJson.message);
        } else {
          // success create album
          if (pathname.includes("user")) {
            router.refresh();
          } else {
            const album: Album = await res.json();
            router.push(`/create?album=${album.id}`);
          }
          setOpen(false);
        }
      },
      onError: () => {
        return toast.error('Something went wrong');

      },
    });

    const onSubmit = async (data: CreateAlbumValidator) => {
      const payload: CreateAlbumValidator = {
        name: data.name,
        description: data.description,
      };

      createAlbumFn(payload);
    };

    const { ref: nameRef, ...nameRest } = register("name");
    const { ref: descriptionRef, ...descriptionRest } = register("description");

    return (
      <>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>{children}</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              className={
                "bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0"
              }
            />
            <Dialog.Content
              ref={ref}
              className={
                "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
              }
            >
              <Dialog.Title>{album ? "Edit" : "Create"} album</Dialog.Title>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <Label className="opacity-75">Name</Label>
                  <Input
                    ref={(e) => {
                      nameRef(e);

                      // @ts-ignore
                      _nameRef.current = e;
                    }}
                    {...nameRest}
                    type="text"
                    placeholder="Name"
                    className="mt-2"
                  />
                </div>
                <div className="mb-4">
                  <Label className="opacity-75">Description</Label>
                  <Input
                    ref={(e) => {
                      descriptionRef(e);

                      // @ts-ignore
                      _descriptionRef.current = e;
                    }}
                    {...descriptionRest}
                    className="mt-2"
                    placeholder="Your album description (Optional)"
                  />
                </div>

                <Button
                  isLoading={isLoading}
                  size="sm"
                  type="submit"
                  className="w-full mb-2"
                >
                  {isLoading ? null : <h4>{album ? "Update" : "Create"}</h4>}
                </Button>
              </form>
              <Dialog.Close
                aria-label="Close"
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                <X />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    );
  }
);

export default CreateAlbum;
