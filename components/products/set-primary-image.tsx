"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { setAsMainImageAction } from "@/lib/products-actions";

export default function SetPrimaryImage({
  imageId,
  productId,
}: {
  imageId: number;
  productId: number;
}) {
  const t = useTranslations("Products");

  async function handleSetPrimaryImage() {
    try {
      const result = await setAsMainImageAction(productId, imageId);

      if (result.success) {
        toast.success(t("SetAsMainSuccess"));
      }
    } catch (err) {
      console.error("Error setting image as main:", err);
      toast.error(t("SetAsMainFailed"));
    }
  }

  return (
    <DropdownMenuItem onClick={handleSetPrimaryImage}>
      {t("SetAsMain")}
    </DropdownMenuItem>
  );
}
