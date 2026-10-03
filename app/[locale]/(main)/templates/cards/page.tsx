import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Card } from "@/types/custom-builder";
import { TemplatesSkeleton } from "@/components/reusable/page-skeletons";
import DataPreviewCards from "@/components/custom-builder/data-preview-cards";

type SearchParams = {
  page?: string;
};

async function GetListOfCards({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const { data, ok } = await http.get<{
    data: {
      items: Card[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/gift-options", {
    next: {
      tags: ["cards"],
    },
    params: {
      kind: "card_style",
      page: page ?? "1",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch cards");
  }

  return (
    <DataPreviewCards
      pagination={data.data.pagination}
      cards={data.data.items}
    />
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<TemplatesSkeleton columns={5} />}>
      <GetListOfCards searchParams={searchParams} />
    </Suspense>
  );
}
