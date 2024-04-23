import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function CreateAlbumCard() {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<PostErrorType>({});

  const submit = () => {
    setLoading(true);

    const data = {
      name: title,
      description,
    };

    axios
      .post("/api/album", data)
      .then((res) => {
        setLoading(false);

        const response = res.data;
        console.log(res);
        console.log(response);
        if (res.status === 200) {
          console.log("200");
          router.refresh();

          setTitle("");
          setDescription("");
          setErrors({});

          toast.success("Success create album !");
        } else if (res.status === 400) {
          console.log("ok err");
          setErrors(response.errors);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("The error is", err);
      });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <article className="flex flex-col justify-center h-full items-center gap-4 p-3 rounded-md text-muted-foreground hover:opacity-95 hover:bg-muted cursor-pointer transition-all">
          <PlusIcon />
          <p>Create Album</p>
        </article>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add Album</DialogHeader>
        <DialogDescription>
          <div className="mb-4 flex flex-col gap-2">
            <Label className="mb-1">Title</Label>
            <Input
              placeholder="The title of your new album"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4 flex flex-col gap-2">
            <Label className="mb-1">Description</Label>
            <Textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The description of your album (optional)"
            >
              {description}
            </Textarea>
          </div>

          <span className="text-red-400 font-bold ml-12">
            {errors?.content}
          </span>
        </DialogDescription>
        <DialogFooter>
          <Button size="sm" disabled={loading} onClick={submit}>
            {loading ? "Processing..." : "Create Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
