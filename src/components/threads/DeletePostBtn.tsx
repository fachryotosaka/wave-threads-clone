"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeletePostBtn({ post }: { post: PostType }) {
  const router = useRouter();
  const deletePost = async () => {
    try {
      const response = await fetch(`/api/post/${post.id}`, {
        method: 'DELETE'
      });
  
      if (response.status === 401) {
        toast.error("Unauthorized !");
      } else if (response.status === 200) {
        toast.success("Success delete comment !");
        router.refresh();
      }
    } catch (err) {
      console.log("An error occurred:", err);
      // Handle the error appropriately, such as displaying an error toast or message to the user.
    }
  };
  

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2
          height={22}
          width={22}
          className="cursor-pointer text-red-400"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-400" onClick={deletePost}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
