"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Field } from "../ui/field";
import { Search } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Category } from "@/types/categories";
import { parseAsString, useQueryState } from "nuqs";

export default function FiltersControl({
  categories,
}: {
  categories: Category[];
}) {
  const locale = useLocale();
  const t = useTranslations("Products");
  const tCategories = useTranslations("Categories");

  const [queryParam, setQueryParam] = useQueryState(
    "query",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );

  const [categoryParam, setCategoryParam] = useQueryState(
    "category",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <div className="flex items-center gap-2">
      <Field>
        <InputGroup className="bg-white h-10">
          <InputGroupInput
            value={queryParam}
            onChange={(e) => setQueryParam(e.target.value)}
            placeholder={t("Filters.SearchPlaceholder")}
            className="min-w-50"
          />
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Select
        value={categoryParam}
        onValueChange={(value) => {
          setCategoryParam(value);
        }}
      >
        <SelectTrigger className="h-10 min-h-10 w-full max-w-48 bg-white px-3 py-2.5 leading-none">
          <SelectValue placeholder={t("Filters.AllCategories")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{tCategories("Categories")}</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name[locale]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
