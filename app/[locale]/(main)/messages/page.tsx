import { Suspense } from "react";
import { http } from "@/lib/http";
import { Message } from "@/types/messages";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import DataPreview from "@/components/messages/data-preview";

async function Messages() {
  const { data, ok } = await http.get<{
    data: {
      items: Message[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/contact-messages", {
    params: {
      per_page: 10,
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

export default async function MessagesPage() {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <Messages />
    </Suspense>
  );
}
