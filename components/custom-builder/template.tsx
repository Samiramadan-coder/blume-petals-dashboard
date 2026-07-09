import { initialTemplates } from "@/constants/custom-builder";
import CreateEdit from "./template/create-edit";
import DataPreview from "./template/data-preview";

export default function Template() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Bouquet Templates
        </h3>

        <CreateEdit />
      </header>

      <DataPreview initialTemplates={initialTemplates} />
    </div>
  );
}
