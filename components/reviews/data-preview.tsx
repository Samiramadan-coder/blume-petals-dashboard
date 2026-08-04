"use client";

import { Rating } from "../ui/rating";
import { Review } from "@/types/reviews";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Pagination } from "@/types/shared";
import { Card, CardContent } from "../ui/card";
import DeleteBtn from "../reusable/delete-btn";
import PaginationTemplate from "../reusable/pagination-temlate";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { deleteReviewAction } from "@/lib/reviews";
import { toast } from "sonner";
import { usePermissions } from "@/providers/permission-providers";

export default function DataPreview({
  reviews,
  pagination,
}: {
  reviews: Review[];
  pagination: Pagination;
}) {
  const { can } = usePermissions();
  const t = useTranslations("Reviews");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <>
      <div className="space-y-3 mb-6">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="rounded-lg border border-primary/20"
            style={{ boxShadow: "none" }}
          >
            <CardContent className="flex gap-4 items-start">
              <Checkbox />

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white font-semibold flex items-center justify-center">
                    {review.user.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{review.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.product.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Rating rating={review.rating} />
                  <span className="text-muted-foreground text-xs">
                    {formatDate(review.created_at)}
                  </span>
                </div>

                <p className="text-foreground leading-relaxed">
                  {review.comment || (
                    <span className="underline text-muted-foreground">
                      {t("NoCommentProvided")}
                    </span>
                  )}
                </p>

                {can("reviews.delete") && (
                  <div className="flex justify-end w-full">
                    <DeleteBtn
                      onDelete={async () => {
                        setLoadingDelete(true);
                        const result = await deleteReviewAction(review);
                        setLoadingDelete(false);
                        if (result.success) {
                          toast.success(tCommon("DeletedSuccessfully"));
                          return;
                        }
                        toast.error(tCommon("DeleteFailed"));
                      }}
                      loading={loadingDelete}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PaginationTemplate
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
      />
    </>
  );
}
