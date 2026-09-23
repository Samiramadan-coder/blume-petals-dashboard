"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Download, Search } from "lucide-react";
import { Field, FieldLabel } from "../ui/field";
import { parseAsString, useQueryStates, debounce } from "nuqs";
import { http } from "@/lib/http";
import { parseCsv } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

export default function FiltersControl() {
  const t = useTranslations("Customers");
  const [loading, setLoading] = useState(false);

  const [{ query, is_admin, is_blocked }, setFilters] = useQueryStates({
    query: parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
    is_admin: parseAsString
      .withDefault("false")
      .withOptions({ history: "push", shallow: false }),
    is_blocked: parseAsString
      .withDefault("false")
      .withOptions({ history: "push", shallow: false }),
    page: parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  });

  async function exportCustomers() {
    setLoading(true);
    try {
      const { data } = await http.get<string>("/api/v1/admin/users/export", {
        params: {
          q: query || "",
          is_admin: is_admin || "",
          is_blocked: is_blocked || "",
        },
      });
      parseCsv(data, `users-export`);
    } catch (error) {
      console.error("Failed to export users:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <Field className="w-auto">
            <InputGroup className="h-10 bg-white">
              <InputGroupInput
                placeholder={t("SearchPlaceholder")}
                value={query}
                onChange={(e) => {
                  const value = e.target.value || null;

                  void setFilters(
                    {
                      query: value || null,
                    },
                    {
                      history: "replace",
                      limitUrlUpdates: value === "" ? undefined : debounce(500),
                    },
                  );
                }}
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field orientation="horizontal" className="w-auto">
            <Checkbox
              id="is-admin-checkbox"
              name="is-admin-checkbox"
              checked={is_admin === "true"}
              onCheckedChange={(checked) =>
                setFilters({ is_admin: checked ? "true" : "false", page: "1" })
              }
            />
            <FieldLabel htmlFor="is-admin-checkbox">
              {t("Filters.IsAdmin")}
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="w-auto">
            <Checkbox
              id="is-blocked-checkbox"
              name="is-blocked-checkbox"
              checked={is_blocked === "true"}
              onCheckedChange={(checked) =>
                setFilters({
                  is_blocked: checked ? "true" : "false",
                  page: "1",
                })
              }
            />
            <FieldLabel htmlFor="is-blocked-checkbox">
              {t("Filters.IsBlocked")}
            </FieldLabel>
          </Field>
        </div>

        <Button
          variant="outline"
          className="h-10 w-30 bg-white text-muted-foreground text-xs"
          onClick={exportCustomers}
          disabled={loading}
        >
          {loading && <Spinner />}
          <Download />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
