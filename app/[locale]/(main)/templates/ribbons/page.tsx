import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Ribbon } from "@/types/custom-builder";
import DataPreviewRibbons from "@/components/custom-builder/data-preview-ribbons";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

type SearchParams = {
  page?: string;
};

async function GetListOfRibbons({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { data, ok } = await http.get<{
    data: {
      items: Ribbon[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/gift-options", {
    next: {
      tags: ["ribbons"],
    },
    params: {
      kind: "ribbon",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch ribbons");
  }

  return (
    <DataPreviewRibbons
      pagination={data.data.pagination}
      ribbons={data.data.items}
    />
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <GetListOfRibbons searchParams={searchParams} />
    </Suspense>
  );
}
