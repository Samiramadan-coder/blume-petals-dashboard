"use client";

import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";
import { deleteImageAction } from "@/lib/products-actions";

export default function DeleteImage({
  imageId,
  productId,
}: {
  imageId: number;
  productId: number;
}) {
  const tCommon = useTranslations("Common");

  async function handleSetPrimaryImage() {
    try {
      const result = await deleteImageAction(productId, imageId);

      if (result.success) {
        toast.success(tCommon("DeletedSuccessfully"));
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      toast.error(tCommon("DeleteFailed"));
    }
  }

  return (
    <DropdownMenuItem variant="destructive" onClick={handleSetPrimaryImage}>
      {tCommon("Delete")}
    </DropdownMenuItem>
  );
}
