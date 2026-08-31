import {
  Funnel,
  TemplateItem,
  SizeItem,
  FlowerItem,
  ColorItem,
  AddonsData,
  UnconvertedData,
  GiftOptionsData,
} from "@/types/reports";
import { http } from "@/lib/http";
import AnalyticsCards from "./analytics-cards";
import MostChosenSize from "./most-choosen-sizes";
import MostChosenColors from "./most-choosen-colors";
import AddonsPerformance from "./add-on-performance";
import MostChosenFlowers from "./most-choosen-flowers";
import MostChosenTemplate from "./most-choosen-templates";
import UnconvertedDesigns from "./unconverted-designs";
import GiftOptionsPerformance from "./gift-options-performance";

export default async function CustomBuilderAnalyticsIndex() {
  const { data, ok } = await http.get<{
    data: {
      funnel: Funnel;
      templates: TemplateItem[];
      sizes: SizeItem[];
      flowers: { items: FlowerItem[] };
      colors: ColorItem[];
      addons: AddonsData;
      unconverted: UnconvertedData;
      gift_options: GiftOptionsData;
    };
  }>("/api/v1/admin/reports/builder");

  if (!ok) {
    throw new Error("Failed to fetch customer stats data");
  }

  console.log(data.data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <AnalyticsCards funnel={data.data.funnel} />

      <div className="sm:col-span-2">
        <MostChosenTemplate templates={data.data.templates} />
      </div>

      <div className="sm:col-span-2">
        <MostChosenSize sizes={data.data.sizes} />
      </div>

      <div className="sm:col-span-2">
        <MostChosenFlowers flowers={data.data.flowers.items} />
      </div>

      <div className="sm:col-span-2">
        <MostChosenColors colors={data.data.colors} />
      </div>

      <div className="sm:col-span-2 md:col-span-4">
        <AddonsPerformance addons={data.data.addons} />
      </div>

      <div className="sm:col-span-2">
        <UnconvertedDesigns unconverted={data.data.unconverted} />
      </div>

      <div className="sm:col-span-2">
        <GiftOptionsPerformance giftOptions={data.data.gift_options} />
      </div>
    </div>
  );
}
