import { Suspense } from "react";
import { http } from "@/lib/http";
import { Spinner } from "@/components/ui/spinner";
import { getTranslations } from "next-intl/server";
import Home from "@/components/website-content/home";
import About from "@/components/website-content/about";
import { AboutPage, HomePage } from "@/types/website-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function GetWebsiteContent() {
  const t = await getTranslations("WebsiteContent");

  const { data: home, ok: ok1 } = await http.get<{
    data: {
      page: {
        sections: HomePage;
      };
    };
  }>("/api/v1/admin/pages/home");

  const { data: about, ok: ok2 } = await http.get<{
    data: {
      page: {
        sections: AboutPage;
      };
    };
  }>("/api/v1/admin/pages/about");

  if (!ok1 || !ok2) {
    throw new Error("Failed to fetch website content");
  }

  console.log(home);

  return (
    <div>
      <Tabs defaultValue="home" className="mb-4">
        <TabsList className="h-10! bg-white">
          <TabsTrigger
            value="home"
            className="h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {t("home")}
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {t("about")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <div className="py-5">
            <Home home={home.data.page.sections} />
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="py-5">
            <About about={about.data.page.sections} />
          </div>
        </TabsContent>
      </Tabs>
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
