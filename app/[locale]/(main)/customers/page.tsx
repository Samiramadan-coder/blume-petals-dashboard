import Statistics from "@/components/customers/statistics";
import DataPreview from "@/components/customers/data-preview";
import { getTranslations } from "next-intl/server";
import { http } from "@/lib/http";
import { User } from "@/types/customers";
import { Pagination } from "@/types/shared";

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

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { query, status, page, is_admin, is_blocked } = await searchParams;

  const { data, ok } = await http.get<{
    data: {
      items: User[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/users", {
    next: {
      revalidate: 60,
    },
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
      <Statistics />
      <DataPreview
        initialCustomers={data.data.items}
        pagination={data.data.pagination}
      />
    </main>
  );
}
