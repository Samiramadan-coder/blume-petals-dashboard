import { getTranslations } from "next-intl/server";
import ModuleHeader from "@/components/reusable/module-header";
import NavigationTabs from "@/components/custom-builder/navigation-tabs";

export default async function CustomBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("CustomBuilder");

  return (
    <div>
      <ModuleHeader title={t("Title")} description={t("Description")} />

      <NavigationTabs />

      {children}
    </div>
  );
}
