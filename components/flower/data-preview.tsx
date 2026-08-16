"use client";

import { useTranslations } from "next-intl";
import ModuleHeader from "../reusable/module-header";
import CreateEdit from "./create-edit";

export default function DataPreview() {
  const t = useTranslations("Flower");
  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        <CreateEdit />
      </ModuleHeader>
    </>
  );
}
