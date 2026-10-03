"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { addImageAction } from "@/lib/products-server";

// Same limit the product, flower and template forms apply to their photos
const MAX_IMAGE_SIZE = 1024 * 1024;

export default function AddImageBtn({ productId }: { productId: number }) {
  const t = useTranslations("Common");
  const tProducts = useTranslations("Products");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        onClick={() => inputRef.current?.click()}
        variant="default"
        size="icon"
        aria-label={t("AddPhoto")}
        disabled={loading}
      >
        {loading ? <Spinner /> : <Plus />}
      </Button>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="add-image"
        ref={inputRef}
        onChange={async (e) => {
          const file = e.target.files?.[0];

          // Allow picking the same file again after a failed upload
          e.target.value = "";

          if (!file) return;

          if (file.size > MAX_IMAGE_SIZE) {
            toast.error(tProducts("Errors.ImageMaxSize"));
            return;
          }

          setLoading(true);

          try {
            const result = await addImageAction(productId, file);

            if (result.success) {
              toast.success(result.message);
              return;
            }

            toast.error(result.message ?? t("ImageAddFailed"));
          } catch (error) {
            console.error("Error adding image:", error);
            toast.error(t("ImageAddFailed"));
          } finally {
            setLoading(false);
          }
        }}
      />
    </>
  );
}
