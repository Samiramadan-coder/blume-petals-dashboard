"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getErrorMessage, http } from "@/lib/http";

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
  const t = useTranslations("WebsiteContent");
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    // Allow picking the same file again after a failed upload
    e.target.value = "";

    if (!file) return;

    const formData = new FormData();

    if (type === "icons") {
      formData.append("icon", file);
    } else {
      formData.append("image", file);
    }

    setUploading(true);

    try {
      const { data } = await http.post<{
        data: {
          path: string;
          url: string;
        };
      }>(`/api/v1/admin/pages/${page}/${type}`, formData);

      onFileChange?.(data.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(getErrorMessage(error) ?? t("uploadFailed"));
    } finally {
      setUploading(false);
    }
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
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Spinner className="me-2 size-4" />
          ) : (
            <ImagePlus className="me-2 size-4" />
          )}
          {t("chooseImage")}
        </Button>

        {imageUrl && (
          <button
            type="button"
            aria-label={t("imagePreview")}
            onClick={() => setOpen(true)}
            className="relative size-14 overflow-hidden rounded-md border"
          >
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{t("imagePreview")}</DialogTitle>

          {imageUrl && (
            <div className="relative h-[80vh] w-full">
              <Image
                src={imageUrl}
                alt={t("imagePreview")}
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
