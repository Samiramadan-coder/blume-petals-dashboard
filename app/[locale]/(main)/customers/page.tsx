import Statistics from "@/components/customers/statistics";
import DataPreview from "@/components/customers/data-preview";
import { getTranslations } from "next-intl/server";
import { http } from "@/lib/http";
import { Summary, User } from "@/types/customers";
import { Pagination } from "@/types/shared";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export async function generateMetadata() {
  const t = await getTranslations("Customers");
  return {
    title: t("Title"),
  };
}

type SearchParams = {
  query?: string;
  status?: string;
  page?: string;
  is_admin?: string;
  is_blocked?: string;
};

async function CustomersPage({ searchParams }: { searchParams: SearchParams }) {
  const { query, status, page, is_admin, is_blocked } = searchParams;

  const { data, ok } = await http.get<{
    data: {
      items: User[];
      pagination: Pagination;
      summary: Summary;
    };
  }>("/api/v1/admin/users", {
    params: {
      per_page: 10,
      page: page || "1",
      q: query || "",
      status: status || "",
      is_admin: is_admin || "false",
      is_blocked: is_blocked || "false",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch customers");
  }

  return (
    <main className="space-y-6">
      <Statistics summary={data.data.summary} />
      <DataPreview
        initialCustomers={data.data.items}
        pagination={data.data.pagination}
      />
    </main>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <CustomersPage searchParams={await searchParams} />
    </Suspense>
  );
}
