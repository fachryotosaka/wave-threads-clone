// Lokasi file: components/AddAlbumModal.tsx
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Image } from "lucide-react";

interface AddAlbumModalProps {
  onClose: () => void;
}

const AddAlbumModal: React.FC<AddAlbumModalProps> = ({ onClose }) => {
  const { toast } = useToast();
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // Perubahan disini

  const handleIconClick = () => {
    imageRef.current?.click();
  };

  const submit = async () => { // Perubahan disini
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post("/api/album", formData); // Perubahan disini
      setLoading(false);
      const response = res.data;
      if (response.status === 400) {
        setErrors(response.errors); // Perubahan disini
      } else if (response.status === 200) {
        setName("");
        setDescription("");
        setImage(null);
        setPreviewUrl(undefined); // Perubahan disini
        setErrors({}); // Perubahan disini
        toast({
          title: "Success",
          description: response.message,
          className: "bg-green-500",
        });
        router.refresh();
        onClose(); // Close modal after successful submission
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response) {
        toast({
          title: "Error",
          description: err.response.data.message,
          className: "bg-red-300",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          className: "bg-red-300",
        });
      }
      console.log("The error is", err);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Tambah Album</h2>
        {errors.name && <span className="text-red-400 font-bold mb-2">{errors.name}</span>} {/* Perubahan disini */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
        />
        {errors.description && <span className="text-red-400 font-bold mb-2">{errors.description}</span>} {/* Perubahan disini */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-3 resize-none"
        />
        <div className="flex justify-end">
          <Button className="mr-2" onClick={onClose}>
            Batal
          </Button>
          <Button disabled={loading} onClick={submit}>
            {loading ? "Memproses.." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAlbumModal;
