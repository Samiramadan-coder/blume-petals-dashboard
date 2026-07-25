"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { Field } from "../ui/field";
import { Button } from "../ui/button";
import { Download, Search } from "lucide-react";
import { customersStatuses } from "@/constants/customers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FiltersControl() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Field className="w-auto">
            <InputGroup className="h-10 bg-white">
              <InputGroupInput placeholder="Search by name, email, phone or phone" />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>

        <Button
          variant="outline"
          className="h-10 w-30 bg-white text-muted-foreground text-xs"
        >
          <Download />
          Export CSV
        </Button>
      </div>

      <Tabs>
        <TabsList className="h-10! rounded-xl bg-muted-foreground/10 p-2">
          {customersStatuses.map((stat) => (
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
    </div>
  );
}
