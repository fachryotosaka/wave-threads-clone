"use client";

import { useState, useRef, useEffect } from "react";
import UserAvatar from "../common/UserAvatar";

import { Button } from "../ui/button";
import ImagePreviewCard from "../common/ImagePreviewCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Image } from "lucide-react";
import { useSearchParam } from "@/hooks/use-search-param";
import AlbumNameFromId from "../album/AlbumNameFromId";
import { toast } from "sonner";

export const ADD_THREAD_SEARCH_PARAM_ALBUM_ID = "albumId";

export default function AddThread() {
  const { data } = useSession();
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setimage] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<PostErrorType>({});

  const [albumId, _setAlbumId] = useSearchParam(ADD_THREAD_SEARCH_PARAM_ALBUM_ID);

  const handleIconClick = () => {
    imageRef.current?.click();
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log("The image is", selectedFile);
      setimage(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(imageUrl);
    }
  };
  const removePriview = () => {
    setimage(null);
    setPreviewUrl(undefined);
  };

  // // langsung buka image picker kalau ada albumId
  // useEffect(() => {
  //   if (albumId) imageRef.current?.click();
  // });

  const submit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    if (albumId) formData.append("albumId", albumId);
    if (image) formData.append("image", image);
  
    fetch("/api/post", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        setLoading(false);
        if (!res.ok) {
          return res.json().then((data) => {
            setErrors(data.errors);
            throw new Error(data.message);
          });
        }
        return res.json();
      })
      .then((response) => {
        if (response.status === 200) {
          setContent("");
          setimage(null);
          setPreviewUrl(undefined);
          setErrors({});
          toast.success("Success create post !");
          router.refresh();
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("An unexpected error occurred. Please try again later.");
        console.log("The error is", err);
      });
  };
  
  return (
    <div className="mt-5">
      {previewUrl ? (
        <div className="mb-5">
          <ImagePreviewCard image={previewUrl} callback={removePriview} />
        </div>
      ) : (
        <></>
      )}
      <div className="flex justify-start items-start">
        <UserAvatar name={data?.user?.name ?? "T"} image="" />
        <textarea
          className="w-full h-24 text-md p-2 bg-muted outline-none  resize-none rounded-lg placeholder:font-normal ml-2"
          placeholder="Type somthing great...."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <span className="text-red-400 font-bold ml-12">{errors?.content}</span>

      <div className="ml-12  flex justify-between items-center">
        <div className="flex flex-col gap-4">
          <input
            type="file"
            ref={imageRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <Image
            onClick={handleIconClick}
            height={20}
            width={20}
            className="cursor-pointer"
          />
          {albumId && <p className="text-sm font-medium">Will be saved in the album "<AlbumNameFromId albumId={albumId} />"</p>}
        </div>
        <Button
          disabled={content.length <= 1 || loading ? true : false}
          onClick={submit}
        >
          {loading ? "Processing.." : "Post"}
        </Button>
      </div>
    </div>
  );
}
