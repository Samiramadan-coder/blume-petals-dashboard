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
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryParam } from "@/hooks/use-search-params";

export default function FiltersControl() {
  const firstRender = useRef(true);
  const searchParams = useSearchParams();
  const { setQueryParam } = useQueryParam();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setQueryParam("search", query);
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
            placeholder="Search products..."
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
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="category1">Category 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
