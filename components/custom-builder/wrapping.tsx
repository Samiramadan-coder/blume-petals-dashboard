import { initialRibbons, initialWrappings } from "@/constants/custom-builder";
import CreateEditRibbons from "./wrapping/create-edit-ribbons";
import CreateEditWrapping from "./wrapping/create-edit-wrapping";
import DataPreviewWrapping from "./wrapping/data-preview-wrapping";
import DataPreviewRibbons from "./wrapping/data-preview-ribbon";

export default function Wrapping() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Wrapping Options
        </h3>

        <CreateEditWrapping />
      </header>

      <DataPreviewWrapping initialWrappings={initialWrappings} />

      <header className="flex items-center gap-4 justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Wrapping Options
        </h3>
        <CreateEditRibbons />
      </header>

      <DataPreviewRibbons initialRibbons={initialRibbons} />
    </div>
  );
}
