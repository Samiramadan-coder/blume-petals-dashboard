import { Suspense } from "react";
import { http } from "@/lib/http";
import { Spinner } from "@/components/ui/spinner";
import { HomePage } from "@/types/website-content";
import Home from "@/components/website-content/home";

async function GetWebsiteContent() {
  const { data, ok } = await http.get<{
    data: {
      page: {
        sections: HomePage;
      };
    };
  }>("/api/v1/admin/pages/home");

  if (!ok) {
    throw new Error("Failed to fetch website content");
  }

  console.log(data.data.page);

  return (
    <div>
      <Home home={data.data.page.sections} />
    </div>
  );
}

export default async function Page() {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <GetWebsiteContent />
    </Suspense>
  );
}
