"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import DeleteBtn from "../reusable/delete-btn";
import { deleteVariantAction } from "@/lib/products-actions";
import { useState } from "react";

export default function DeleteVariantAction({
  productId,
  variantId,
}: {
  productId: number;
  variantId: number;
}) {
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <DeleteBtn
      loading={loadingDelete}
      onDelete={async () => {
        setLoadingDelete(true);
        const result = await deleteVariantAction(productId, variantId);
        setLoadingDelete(false);
        if (result.success) {
          toast.success(tCommon("DeletedSuccessfully"));
          return;
        }
        toast.error(tCommon("DeleteFailed"));
      }}
    />
  );
}
