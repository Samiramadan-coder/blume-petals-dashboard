"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

import { http } from "@/lib/http";
import { useEffect, useRef, useState } from "react";
import { Loader2, Package, Search, ShoppingBag, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type Customer = {
  id: number;
  phone: string | null;
  is_blocked: boolean;
  name: string;
  email: string;
};

type Order = {
  currency: string;
  customer_name: string;
  grand_total: string;
  id: number;
  order_number: number;
  payment_status: string;
  placed_at: string;
  status: string;
};

type Product = {
  id: number;
  image_url: string;
  name: string;
  price_from: string;
  slug: string;
  status: string;
};

type SearchResults = {
  customers: Customer[];
  orders: Order[];
  products: Product[];
};

type SearchState = {
  query: string;
  status: "loading" | "success" | "error";
  results: SearchResults;
};

const emptyResults: SearchResults = {
  customers: [],
  orders: [],
  products: [],
};

export default function GlobalSearch() {
  const router = useRouter();
  const t = useTranslations("layout.header");
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchState, setSearchState] = useState<SearchState | null>(null);

  const searchQuery = query.trim();
  const isCurrentResult = searchState?.query === searchQuery;

  const loading =
    searchQuery.length > 0 &&
    (!isCurrentResult || searchState?.status === "loading");

  const hasError = isCurrentResult && searchState?.status === "error";

  const results =
    isCurrentResult && searchState?.status === "success"
      ? searchState.results
      : emptyResults;

  const hasResults =
    results.customers.length > 0 ||
    results.orders.length > 0 ||
    results.products.length > 0;

  useEffect(() => {
    if (!searchQuery) return;

    let cancelled = false;

    const timeout = setTimeout(async () => {
      setSearchState({
        query: searchQuery,
        status: "loading",
        results: emptyResults,
      });

      try {
        const { data } = await http.get<{
          data: SearchResults;
        }>("/api/v1/admin/search", {
          params: { q: searchQuery },
        });

        if (cancelled) return;

        setSearchState({
          query: searchQuery,
          status: "success",
          results: {
            customers: data.data.customers ?? [],
            orders: data.data.orders ?? [],
            products: data.data.products ?? [],
          },
        });
      } catch (error) {
        if (cancelled) return;

        console.error("Search error:", error);

        setSearchState({
          query: searchQuery,
          status: "error",
          results: emptyResults,
        });
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  const itemClassName =
    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-start transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xs"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <InputGroup className="bg-background hidden sm:flex">
        <InputGroupInput
          placeholder={t("SearchPlaceholder")}
          aria-label="Global search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="placeholder:text-sm"
        />

        <InputGroupAddon>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
        </InputGroupAddon>
      </InputGroup>

      {open && searchQuery && (
        <div
          aria-label="Search results"
          aria-busy={loading}
          className="absolute inset-s-0 top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {loading ? (
            <div
              role="status"
              className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground"
            >
              <Loader2 className="size-4 animate-spin" />
              {t("Searching")}
            </div>
          ) : hasError ? (
            <p
              role="alert"
              className="px-4 py-6 text-center text-sm text-destructive"
            >
              {t("Unable")}
            </p>
          ) : !hasResults ? (
            <p
              role="status"
              className="px-4 py-6 text-center text-sm text-muted-foreground"
            >
              {t("NoResultsFound")}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {results.customers.length > 0 && (
                <section className="py-1">
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {t("Customers")}
                  </h3>

                  {results.customers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      className={itemClassName}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/customers?query=${customer.name}`);
                      }}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <UserRound className="size-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {customer.name}
                        </span>

                        <span className="block truncate text-xs text-muted-foreground">
                          {customer.email || customer.phone}
                        </span>
                      </span>
                    </button>
                  ))}
                </section>
              )}

              {results.orders.length > 0 && (
                <section className="py-1">
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {t("Orders")}
                  </h3>

                  {results.orders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      className={itemClassName}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/orders?query=${order.order_number}`);
                      }}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ShoppingBag className="size-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          #{order.order_number}
                        </span>

                        <span className="block truncate text-xs text-muted-foreground">
                          {order.customer_name}
                        </span>
                      </span>

                      <span className="shrink-0 text-xs font-medium">
                        {order.grand_total} {order.currency}
                      </span>
                    </button>
                  ))}
                </section>
              )}

              {results.products.length > 0 && (
                <section className="py-1">
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {t("Products")}
                  </h3>

                  {results.products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className={itemClassName}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/products?query=${product.name}`);
                      }}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Package className="size-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {product.name}
                        </span>

                        <span className="block truncate text-xs text-muted-foreground">
                          {product.status}
                        </span>
                      </span>

                      <span className="shrink-0 text-xs font-medium">
                        {product.price_from}
                      </span>
                    </button>
                  ))}
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
