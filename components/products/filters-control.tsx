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
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryParam } from "@/hooks/use-search-params";
import { Category } from "@/types/categories";
import { useLocale } from "next-intl";

export default function FiltersControl({
  categories,
}: {
  categories: Category[];
}) {
  const locale = useLocale();
  const firstRender = useRef(true);
  const t = useTranslations("Products");
  const searchParams = useSearchParams();
  const { setQueryParam } = useQueryParam();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setQueryParam("query", query);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex items-center gap-2">
      <Field>
        <InputGroup className="bg-white h-10">
          <InputGroupInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Filters.SearchPlaceholder")}
            className="min-w-50"
          />
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Select
        value={category}
        onValueChange={(value) => {
          setCategory(value);
          setQueryParam("category", value);
        }}
      >
        <SelectTrigger className="h-10 min-h-10 w-full max-w-48 bg-white px-3 py-2.5 leading-none">
          <SelectValue placeholder={t("Filters.AllCategories")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
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
