import { initialFlowers } from "@/constants/custom-builder";
import CreateEdit from "./flowers/create-edit";
import DataPreview from "./flowers/data-preview";

export default function Flowers() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 justify-between">
        <h3 className="text-sm font-semibold text-foreground">Flower Types</h3>
        <CreateEdit />
      </header>

      <DataPreview initialFlowers={initialFlowers} />
    </div>
  );
}
