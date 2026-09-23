"use client";

import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Button } from "../ui/button";

import { Field } from "../ui/field";
import { Search, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "../ui/card";
import { parseAsString, useQueryStates, debounce } from "nuqs";

export default function FiltersControl() {
  const t = useTranslations("Reviews");

  const [{ query, rating, sort, flagged }, setFilters] = useQueryStates({
    query: parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),

    rating: parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),

    sort: parseAsString
      .withDefault("newest")
      .withOptions({ history: "push", shallow: false }),

    flagged: parseAsString
      .withDefault("false")
      .withOptions({ history: "push", shallow: false }),
  });

  return (
    <Card className="border border-primary/20" style={{ boxShadow: "none" }}>
      <CardContent className="flex items-center flex-wrap gap-3">
        <Field className="flex-1">
          <InputGroup className="bg-white h-10">
            <InputGroupInput
              value={query}
              onChange={(e) =>
                setFilters(
                  { query: e.target.value },
                  {
                    history: "replace",
                    limitUrlUpdates:
                      e.target.value === "" ? undefined : debounce(500),
                  },
                )
              }
              placeholder={t("SearchPlaceholder")}
            />
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Select
          value={rating}
          onValueChange={(value) => {
            setFilters({ rating: value });
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
          value={sort}
          onValueChange={(value) => {
            setFilters({ sort: value });
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

        <Select
          value={flagged}
          onValueChange={(value) => {
            setFilters({ flagged: value });
          }}
        >
          <SelectTrigger className="h-10 flex-1 min-h-10 w-full bg-white px-3 py-2.5 leading-none">
            <SelectValue placeholder={t("NotFlagged")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("Flagged")}</SelectLabel>
              <SelectItem value="false">{t("NotFlagged")}</SelectItem>
              <SelectItem value="true">{t("Flagged")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          className="h-10"
          onClick={() => {
            setFilters({
              query: "",
              rating: "",
              sort: "newest",
              flagged: "",
            });
          }}
        >
          {t("ClearFilters")}
        </Button>
      </CardContent>
    </Card>
  );
}
