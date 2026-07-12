"use client";

import Image from "next/image";
import Statistics from "./statistics";
import CreateEdit from "./create-edit";
import { Checkbox } from "../ui/checkbox";
import { Product } from "@/types/products";
import EditBtn from "../reusable/edit-btn";
import { useTranslations } from "next-intl";
import FiltersControl from "./filters-control";
import { columns } from "@/constants/products";
import DeleteBtn from "../reusable/delete-btn";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { Switch } from "../ui/switch";
import { Dot, Star } from "lucide-react";
import { Badge } from "../ui/badge";

export default function DataPreview({ products }: { products: Product[] }) {
  const t = useTranslations("Products");

  return (
    <>
      <header className="flex items-center justify-between">
        <FiltersControl />
        <CreateEdit />
      </header>

      <Statistics />

      <DataTable
        columns={columns(t)}
        rowsCount={products.length}
        countUnit={t("Products")}
        onNextPage={() => {}}
        onPreviousPage={() => {}}
        onCheckboxChange={(checked) => console.log(checked)}
      >
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <Checkbox />
            </TableCell>

            <TableCell className="px-4 py-3">
              <Image
                src={product.images[0] as string}
                alt={product.name}
                width={50}
                height={80}
              />
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="font-semibold">{product.name}</p>
              <p className="text-muted-foreground text-xs mt-1">BP-ADN-010</p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <span className="text-muted-foreground">{product.category}</span>
            </TableCell>

            <TableCell className="px-4 py-3">
              <span className="font-semibold">{product.price}</span>
            </TableCell>

            <TableCell className="px-4 py-3">
              <Badge className="bg-primary/30 text-primary">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary"></span>{" "}
                In Stock
              </Badge>
              <p className="text-muted-foreground text-xs mt-1">
                20 {t("Labels.Units")}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Star className="size-2.5 text-primary fill-primary" />
                <span className="font-semibold text-xs">4.9</span>
                <span className="text-xs text-muted-foreground">(120)</span>
              </div>
            </TableCell>

            <TableCell className="px-4 py-3">
              <Switch />
            </TableCell>

            <TableCell className="px-4 py-3 text-center">
              <CreateEdit product={product} trigger={<EditBtn />} />
              <DeleteBtn />
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </>
  );
}
