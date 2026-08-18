"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRef } from "react";
import { addImageAction } from "@/lib/products-actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AddImageBtn({ productId }: { productId: number }) {
  const t = useTranslations("Common");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        onClick={() => inputRef.current?.click()}
        variant="default"
        size="icon"
      >
        <Plus />
      </Button>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="add-image"
        ref={inputRef}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const result = await addImageAction(productId, file);

            if (result.success) {
              toast.success(t("ImageAddedSuccessfully"));
              return;
            }

            toast.error(t("FailedToAddImage"));
          }
        }}
      />
    </>
  );
}
