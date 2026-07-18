"use client";

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
    } catch (err) {}
  }

  return (
    <DropdownMenuItem onClick={handleSetPrimaryImage}>
      {t("SetAsMain")}
    </DropdownMenuItem>
  );
}
