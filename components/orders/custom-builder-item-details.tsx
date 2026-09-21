"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Item } from "@/types/orders";
import { NotebookTabs } from "lucide-react";
import { Separator } from "../ui/separator";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function CustomBuilderItemDetails({ item }: { item: Item }) {
  const locale = useLocale();
  const t = useTranslations("Orders");
  const tCommon = useTranslations("Common");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <NotebookTabs className="text-primary" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm ring-0!" showCloseButton={false}>
        <div className="-mx-4 max-h-[60vh] overflow-y-auto px-4">
          {item.image_url && (
            <div className="mb-2">
              <Image
                src={item.image_url}
                alt={item.name}
                width={400}
                height={400}
                className="object-cover rounded-md"
              />
            </div>
          )}

          <div>
            <h3 className="font-bold mb-2 text-muted-foreground">
              {t("Components")}
            </h3>
            <div className="space-x-2 flex flex-wrap">
              {item.component_snapshot.map((component, index) => (
                <div key={index}>
                  <span className="font-bold">{component.qty}x</span>{" "}
                  <span className="italic underline">
                    {component[`name_${locale}`]}.
                  </span>
                </div>
              ))}
            </div>
          </div>

          {item.gift?.ribbon && (
            <>
              <Separator className="my-2" />
              <div>
                <h3 className="font-bold mb-1 text-muted-foreground">
                  {t("Ribbon")}
                </h3>
                <div className="space-x-2 flex flex-wrap items-center">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-primary">
                      {t("Color")}:
                    </span>
                    <div
                      className="size-8 rounded-full"
                      style={{ backgroundColor: item.gift?.ribbon.color_hex }}
                    />
                  </div>

                  <div className="ml-2">
                    <span className="font-bold text-primary">
                      {t("Price")}:
                    </span>{" "}
                    {tCommon("AED")} {item.gift?.ribbon.price}
                  </div>
                </div>
              </div>
            </>
          )}

          {item.gift?.card_style && (
            <>
              <Separator className="my-2" />
              <div>
                <h3 className="font-bold mb-1 text-muted-foreground">
                  {t("Card")}
                </h3>
                <div className="space-x-2 flex flex-wrap">
                  <div>
                    <span className="font-bold text-primary">{t("Name")}:</span>{" "}
                    {item.gift?.card_style[`name_${locale}`]}
                  </div>
                  <div className="ml-2">
                    <span className="font-bold text-primary">
                      {t("Price")}:
                    </span>{" "}
                    {tCommon("AED")} {item.gift?.card_style.price}
                  </div>
                </div>
                <div className="mt-1">
                  <span className="font-bold text-primary">
                    {t("Message")}:
                  </span>{" "}
                  {item.message_text}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
