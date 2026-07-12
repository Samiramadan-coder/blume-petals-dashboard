import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Download, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { orderStatuses } from "@/constants/orders";
import { useQueryParam } from "@/hooks/use-search-params";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FiltersControl() {
  const firstTrigger = useRef(true);
  const searchParams = useSearchParams();
  const { setQueryParam } = useQueryParam();
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState(
    searchParams.get("channel") || "all-channels",
  );
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");

  useEffect(() => {
    if (firstTrigger.current) {
      firstTrigger.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setQueryParam("query", query);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
      <Tabs
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          setQueryParam("status", value);
        }}
      >
        <TabsList className="h-10! rounded-xl bg-muted-foreground/10 p-2">
          {orderStatuses.map((stat) => (
            <TabsTrigger
              key={stat.value}
              value={stat.value}
              className={cn(
                `h-8 rounded-lg px-4 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:bg-white data-[state=active]:shadow-sm cursor-pointer`,
              )}
            >
              {stat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Field className="w-auto">
            <InputGroup className="h-10 bg-white">
              <InputGroupInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order #, Customer..."
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Select
            value={channel}
            onValueChange={(value) => {
              setChannel(value);
              setQueryParam("channel", value);
            }}
          >
            <SelectTrigger className="h-10 min-h-10 bg-white px-3 py-2.5 leading-none">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Channels</SelectLabel>
                <SelectItem value="all-channels">All Channels</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Field className="w-auto">
              <Input
                type="date"
                value={dateFrom}
                onChange={(event) => {
                  setDateFrom(event.target.value);
                  setQueryParam("dateFrom", event.target.value);
                }}
                className="h-10 min-w-35 bg-white px-3 py-2 text-sm "
              />
            </Field>

            <Field className="w-auto">
              <Input
                type="date"
                value={dateTo}
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setQueryParam("dateTo", event.target.value);
                }}
                className="h-10 min-w-35 bg-white px-3 py-2 text-sm"
              />
            </Field>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-10 w-30 bg-white text-muted-foreground text-xs"
        >
          <Download />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
