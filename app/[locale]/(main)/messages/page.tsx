import { Suspense } from "react";
import { http } from "@/lib/http";
import { Message } from "@/types/messages";
import { Pagination } from "@/types/shared";
import { MessagesSkeleton } from "@/components/reusable/page-skeletons";
import DataPreview from "@/components/messages/data-preview";

type SearchParams = {
  page?: string;
};

async function Messages({ searchParams }: { searchParams: SearchParams }) {
  const { data, ok } = await http.get<{
    data: {
      items: Message[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/contact-messages", {
    params: {
      per_page: 10,
      page: searchParams.page || 1,
    },
    next: {
      tags: ["messages"],
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch messages");
  }

  return (
    <main className="space-y-6">
      <DataPreview
        key={JSON.stringify(data.data.items)}
        messages={data.data.items}
        pagination={data.data.pagination}
      />
    </main>
  );
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<MessagesSkeleton />}>
      <Messages searchParams={await searchParams} />
    </Suspense>
  );
}
