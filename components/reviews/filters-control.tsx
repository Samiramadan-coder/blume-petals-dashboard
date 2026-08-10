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
import { Search, Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { parseAsString, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import { Field } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Button } from "../ui/button";

export default function FiltersControl() {
  const t = useTranslations("Reviews");

  const [queryParam, setQueryParam] = useQueryState(
    "query",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );

  const [ratingParam, setRatingParam] = useQueryState(
    "rating",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );

  const [sortParam, setSortParam] = useQueryState(
    "sort",
    parseAsString
      .withDefault("newest")
      .withOptions({ history: "push", shallow: false }),
  );
  return (
    <Card className="border border-primary/20" style={{ boxShadow: "none" }}>
      <CardContent className="flex items-center flex-wrap gap-3">
        <Field className="flex-1">
          <InputGroup className="bg-white h-10 ">
            <InputGroupInput
              value={queryParam}
              onChange={(e) => setQueryParam(e.target.value)}
              placeholder={t("SearchPlaceholder")}
            />
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Select
          value={ratingParam}
          onValueChange={(value) => {
            setRatingParam(value);
          }}
        >
          <SelectTrigger className="flex-1 h-10 min-h-10 w-full bg-white px-3 py-2.5 leading-none">
            <SelectValue placeholder={t("AllRatings")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("Rating")}</SelectLabel>
              <SelectItem value="5">
                5 <Star className="size-3 fill-primary text-primary" />
              </SelectItem>
              <SelectItem value="4">
                4 <Star className="size-3 fill-primary text-primary" />
              </SelectItem>
              <SelectItem value="3">
                3 <Star className="size-3 fill-primary text-primary" />
              </SelectItem>
              <SelectItem value="2">
                2 <Star className="size-3 fill-primary text-primary" />
              </SelectItem>
              <SelectItem value="1">
                1 <Star className="size-3 fill-primary text-primary" />
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={sortParam}
          onValueChange={(value) => {
            setSortParam(value);
          }}
        >
          <SelectTrigger className="h-10 flex-1 min-h-10 w-full bg-white px-3 py-2.5 leading-none">
            <SelectValue placeholder={t("Newest")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("SortBy")}</SelectLabel>
              <SelectItem value="newest">{t("Newest")}</SelectItem>
              <SelectItem value="oldest">{t("Oldest")}</SelectItem>
              <SelectItem value="highest">{t("HighestRating")}</SelectItem>
              <SelectItem value="lowest">{t("LowestRating")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          className="h-10"
          onClick={() => {
            setQueryParam("");
            setRatingParam("");
            setSortParam("newest");
          }}
        >
          {t("ClearFilters")}
        </Button>
      </CardContent>
    </Card>
  );
}
