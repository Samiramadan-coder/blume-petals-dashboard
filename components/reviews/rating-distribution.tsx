import { Star } from "lucide-react";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";

export default async function RatingDistribution() {
  const t = await getTranslations("Reviews");
  return (
    <Card className="py-8">
      <CardContent className="px-8">
        <h3 className="text-lg font-semibold mb-4">
          {t("RatingDistribution")}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs">5</span>{" "}
              <Star className="size-3 fill-primary text-primary" />
            </div>
            <Progress value={80} className="w-full h-2" />
            <span>30</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs">4</span>{" "}
              <Star className="size-3 fill-primary text-primary" />
            </div>
            <Progress value={50} className="w-full h-2" />
            <span>25</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs">3</span>{" "}
              <Star className="size-3 fill-primary text-primary" />
            </div>
            <Progress value={40} className="w-full h-2" />
            <span>20</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs">2</span>{" "}
              <Star className="size-3 fill-primary text-primary" />
            </div>
            <Progress value={20} className="w-full h-2" />
            <span>15</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs">1</span>{" "}
              <Star className="size-3 fill-primary text-primary" />
            </div>
            <Progress value={10} className="w-full h-2" />
            <span>10</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
