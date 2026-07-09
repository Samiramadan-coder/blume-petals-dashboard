"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import CreateEdit from "./create-edit";
import { Checkbox } from "../ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/types/products";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { columns } from "@/constants/products";
import FiltersControl from "./filters-control";
import Statistics from "./statistics";

export default function DataPreview({ products }: { products: Product[] }) {
  return (
    <>
      <header className="flex items-center justify-between">
        <FiltersControl />
        <CreateEdit />
      </header>
      <Statistics />

      <DataTable
        columns={columns}
        rowsCount={products.length}
        countUnit="products"
        onNextPage={() => {
          console.log("Next page clicked");
        }}
        onPreviousPage={() => {
          console.log("Previous page clicked");
        }}
        onCheckboxChange={(checked) => {
          console.log("Checkbox changed:", checked);
        }}
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
            <TableCell className="px-4 py-3">{product.name}</TableCell>
            <TableCell className="px-4 py-3">{product.category}</TableCell>
            <TableCell className="px-4 py-3">{product.price}</TableCell>
            <TableCell className="px-4 py-3">{product.stockQuantity}</TableCell>
            <TableCell className="px-4 py-3">{product.rating}</TableCell>
            <TableCell className="px-4 py-3">{product.productStatus}</TableCell>
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
