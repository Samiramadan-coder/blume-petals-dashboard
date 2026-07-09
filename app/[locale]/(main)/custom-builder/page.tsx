import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabs, tabContents } from "@/constants/custom-builder";
import { Settings2 } from "lucide-react";

export default function CustomBuilderPage() {
  return (
    <main className="space-y-6">
      <header>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/20 rounded-md">
            <Settings2 className="size-5 text-primary" />
          </div>

          <div>
            <h1 className="text-base font-semibold text-foreground font-heading">
              Custom Builder Settings
            </h1>
            <p className="text-xs text-muted-foreground">
              Control every option customers see in the builder
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4">
        <Tabs defaultValue="templates" className="space-y-2 col-span-3">
          <TabsList className="h-12! bg-primary/5 w-full shadow-sm rounded-md">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="cursor-pointer border-0 text-sm data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabContents.map((tabContent) => (
            <TabsContent key={tabContent.value} value={tabContent.value}>
              {tabContent.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
