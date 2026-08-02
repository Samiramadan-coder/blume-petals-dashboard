import { Star } from "lucide-react";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";

const ratingDisribution = {
  "5": 0,
  "4": 0,
  "3": 0,
  "2": 0,
  "1": 0,
};

export default async function RatingDistribution({
  totalReviews,
}: {
  totalReviews: number;
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

        <div className="space-y-2">
          {Object.entries(ratingDisribution).map(([rating, count]) => (
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
