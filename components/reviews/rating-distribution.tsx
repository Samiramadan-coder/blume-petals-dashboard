import { Star } from "lucide-react";
import { Summary } from "@/types/reviews";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";

export default async function RatingDistribution({
  totalReviews,
  summary,
}: {
  totalReviews: number;
  summary: Summary;
}) {
  const t = await getTranslations("Reviews");

  return (
    <Card
      className="py-8 border border-primary/20"
      style={{ boxShadow: "none" }}
    >
      <CardContent className="px-8">
        <h3 className="text-lg font-semibold mb-4">
          {t("RatingDistribution")}
        </h3>

        <div className="flex flex-col-reverse gap-2">
          {Object.entries(summary.distribution).map(([rating, count]) => (
            <div key={rating} className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-xs">{rating}</span>{" "}
                <Star className="size-3 fill-primary text-primary" />
              </div>
              <Progress
                value={(count / totalReviews) * 100}
                className="w-full h-2"
              />
              <span>{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
