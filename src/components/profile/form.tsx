"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";   

export default function EditProfileDialog({ userProfile }) {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    name: "",
    image: "", // Add the image field to formValues
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const { data: session, update: UpdateSession } = useSession();
  const user = session?.user;
  const [image, setImage] = useState("");

  useEffect(() => {
    if (user) {
      // Set the initial form values only when user data is available
      setFormValues({ name: user.name ?? "", id: user.id ?? "", image: user.image ?? "" });
    }
  }, [user]);
  

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Add null check with optional chaining
    
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create temporary object URL
      setImage(imageUrl);
      setFormValues({ ...formValues, image: imageUrl });
    }
  };

  const submitProfile = async (e: React.FormEvent) => {
    setLoading(true);

    e.preventDefault();

    await fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(formValues),
    })
    .then(async (res) => {
        setLoading(false);
        UpdateSession({ name: formValues.name });
        if (res.ok) {
            toast.success("Profile updated successfully");
            setTimeout(() => {
                router.refresh();
            }, 3000);
        } else {
            const errorMessage = await res.text(); // Get the error message from the response
            toast.error(errorMessage || "Failed to update profile");
            return Promise.reject(errorMessage || "Failed to update profile");
        }
    })
    .catch((err) => {
        setLoading(false);
        console.error("Error updating profile:", err);
        toast.error("An error occurred while updating profile");
    });
};


  return (
    <Dialog>
      <DialogTrigger>
      <div className={`${buttonVariants({ size: 'sm' })} inline-flex items-center justify-center`}>
        Edit profile
      </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Edit Profile</DialogHeader>
        <DialogDescription>
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="name" className="mb-1">Name</label>
            <Input
              id="name"
              value={formValues.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            />
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button disabled={loading} onClick={submitProfile}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
