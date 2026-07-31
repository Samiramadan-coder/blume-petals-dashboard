"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { parseAsString, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";

export default function FiltersControl() {
  const t = useTranslations("Reviews");

  const [ratingParam, setRatingParam] = useQueryState(
    "rating",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <Select
          value={ratingParam}
          onValueChange={(value) => {
            setRatingParam(value);
          }}
        >
          <SelectTrigger className="h-10 min-h-10 w-full max-w-48 bg-white px-3 py-2.5 leading-none">
            <SelectValue placeholder={t("AllRatings")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("Rating")}</SelectLabel>
              <SelectItem value="5">
                5 <Star className="size-3 fill-black" />
              </SelectItem>
              <SelectItem value="4">
                4 <Star className="size-3 fill-black" />
              </SelectItem>
              <SelectItem value="3">
                3 <Star className="size-3 fill-black" />
              </SelectItem>
              <SelectItem value="2">
                2 <Star className="size-3 fill-black" />
              </SelectItem>
              <SelectItem value="1">
                1 <Star className="size-3 fill-black" />
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
