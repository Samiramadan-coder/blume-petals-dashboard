"use client";

import { usePermissions } from "@/providers/permission-providers";
import { useTranslations } from "next-intl";
import Create from "./create";
import ModuleHeader from "../reusable/module-header";

export default function DataPreview() {
  const t = useTranslations("Notifications");
  const { can } = usePermissions();

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        {can("catalog.create") && <Create />}
      </ModuleHeader>
    </>
  );
}
