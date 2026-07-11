"use client";

// import Image from "next/image";
import Statistics from "./statistics";
import { Button } from "../ui/button";
import CreateEdit from "./create-edit";
import { Checkbox } from "../ui/checkbox";
import { Product } from "@/types/products";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import FiltersControl from "./filters-control";
import { columns } from "@/constants/products";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";

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
        onCheckboxChange={(checked) => {}}
      >
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <Checkbox />
            </TableCell>
            <TableCell className="px-4 py-3">
              -
              {/* <Image
                src={product.images[0] as string}
                alt={product.name}
                width={50}
                height={80}
              /> */}
            </TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3 text-center">
              <CreateEdit
                product={product}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    className="cursor-pointer"
                  >
                    <Pencil className="text-muted-foreground" />
                  </Button>
                }
              />
              <Button variant="ghost" className="cursor-pointer">
                <Trash2 className="text-muted-foreground" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </>
  );
}
