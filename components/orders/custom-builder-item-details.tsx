"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Item } from "@/types/orders";
import { NotebookTabs } from "lucide-react";
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

      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden ring-0">
        <div className="max-h-[85vh] overflow-y-auto">
          {item.image_url && (
            <div className="relative flex min-h-125 items-center justify-center bg-muted/30 p-6">
              <Image
                src={item.image_url}
                alt={item.name}
                width={700}
                height={700}
                className="max-h-125 w-auto rounded-xl object-contain"
                sizes="700px"
              />
            </div>
          )}

          <div className="space-y-5 p-6">
            <div>
              <h3 className="mb-3 text-sm font-bold text-muted-foreground">
                {t("Components")}
              </h3>

              <div className="flex flex-wrap gap-2">
                {item.component_snapshot.map((component, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-background px-3 py-2 text-sm"
                  >
                    <span className="font-bold text-primary">
                      {component.qty}x
                    </span>

                    <span className="ms-1">{component[`name_${locale}`]}</span>
                  </div>
                ))}
              </div>
            </div>

            {item.gift?.ribbon && (
              <div className="rounded-xl border bg-muted/20 p-4">
                <h3 className="mb-3 text-sm font-bold text-muted-foreground">
                  {t("Ribbon")}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">
                      {t("Color")}
                    </span>

                    <span
                      className="size-8 rounded-full border"
                      style={{
                        backgroundColor: item.gift.ribbon.color_hex,
                      }}
                    />
                  </div>

                  <p className="text-sm">
                    <span className="font-semibold text-primary">
                      {t("Price")}:
                    </span>{" "}
                    {tCommon("AED")} {item.gift.ribbon.price}
                  </p>
                </div>
              </div>
            )}

            {item.gift?.card_style && (
              <div className="rounded-xl border bg-muted/20 p-4">
                <h3 className="mb-3 text-sm font-bold text-muted-foreground">
                  {t("Card")}
                </h3>

                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-semibold text-primary">
                      {t("Name")}:
                    </span>{" "}
                    {item.gift.card_style[`name_${locale}`]}
                  </p>

                  <p>
                    <span className="font-semibold text-primary">
                      {t("Price")}:
                    </span>{" "}
                    {tCommon("AED")} {item.gift.card_style.price}
                  </p>
                </div>

                {item.message_text && (
                  <div className="mt-4 rounded-lg bg-white p-3 text-sm">
                    <p className="mb-1 font-semibold text-primary">
                      {t("Message")}
                    </p>

                    <p className="text-muted-foreground">{item.message_text}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
