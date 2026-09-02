"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { parseAsString, useQueryStates } from "nuqs";

export default function FiltersControl() {
  const [filters, setFilters] = useQueryStates({
    days: parseAsString
      .withDefault("30")
      .withOptions({ history: "push", shallow: false }),
  });

  return (
    <div className="flex items-center gap-4">
      <Select
        value={filters.days}
        onValueChange={(value) => setFilters({ days: value })}
      >
        <SelectTrigger className="w-full max-w-48 min-h-10 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="1">Today</SelectItem>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="0">This Month</SelectItem>
            <SelectItem value="60">Last Month</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
