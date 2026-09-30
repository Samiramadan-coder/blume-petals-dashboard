"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { http } from "@/lib/http";

type ImageUploadProps = {
  imageUrl?: string | null;
  onFileChange?: (image: { path: string; url: string }) => void;
  page: "home" | "about";
  type: "images" | "icons";
};

export default function ImageUpload({
  imageUrl,
  onFileChange,
  page,
  type,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    const formData = new FormData();

    if (type === "icons") {
      formData.append("icon", file);
    } else {
      formData.append("image", file);
    }

    const { data } = await http.post<{
      data: {
        path: string;
        url: string;
      };
    }>(`/api/v1/admin/pages/${page}/${type}`, formData);

    console.log(data);

    onFileChange?.(data.data);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="me-2 size-4" />
          Choose image
        </Button>

        {imageUrl && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative size-14 overflow-hidden rounded-md border"
          >
            <Image
              src={imageUrl}
              alt="Uploaded image"
              fill
              sizes="56px"
              className="object-cover"
            />
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl">
          <DialogTitle className="sr-only">Image preview</DialogTitle>

          {imageUrl && (
            <div className="relative h-[80vh] w-full">
              <Image
                src={imageUrl}
                alt="Uploaded image"
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
