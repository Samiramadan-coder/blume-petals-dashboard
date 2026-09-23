import { Star, TriangleAlert } from "lucide-react";
import { Summary, NeedsAttention } from "@/types/reviews";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";
import { Separator } from "../ui/separator";
import { Rating } from "../ui/rating";
import { Link } from "@/i18n/navigation";

export default async function RatingDistribution({
  summary,
  needsAttention,
}: {
  summary: Summary;
  needsAttention: NeedsAttention[];
}) {
  const t = await getTranslations("Reviews");
  const totalReviews = Object.values(summary.distribution).reduce(
    (acc, count) => acc + count,
    0,
  );

  return (
    <div>
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

          <Separator className="my-5" />

          <div>
            <h3 className="flex items-center gap-2 mb-3">
              <TriangleAlert className="size-4 text-destructive" />
              <span className="font-bold">{t("ProductsNeedAttention")}</span>
            </h3>

            {needsAttention.map((item) => (
              <Link href={`/products?query=${item.name}`} key={item.product_id}>
                <div
                  key={item.product_id}
                  className="border border-destructive/10 bg-destructive/5 py-2 px-3 rounded-lg mb-2"
                >
                  <p className="text-xs font-semibold">{item.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Rating
                      rating={+item.rating_avg}
                      size={12}
                      className="text-destructive!"
                    />
                    {item.rating_avg}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
