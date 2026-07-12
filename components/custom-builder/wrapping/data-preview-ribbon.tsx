"use client";

import { useState } from "react";
import CreateEditRibbon from "./create-edit-ribbons";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ribbon, Wrapping } from "@/types/custom-builder";
import { TableCell } from "@/components/ui/table";
import { wrappingColumns } from "@/constants/custom-builder";
import { ReorderableDataTable } from "@/components/reusable/date-sortable-table";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import EditBtn from "@/components/reusable/edit-btn";
import DeleteBtn from "@/components/reusable/delete-btn";

export default function DataPreviewRibbons({
  initialRibbons,
}: {
  initialRibbons: Ribbon[];
}) {
  const [ribbons, setRibbons] = useState<Ribbon[]>(initialRibbons);

  return (
    <div className="p-4 bg-white rounded-lg border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ribbons.map((ribbon) => (
          <Card className="bg-background" key={ribbon.id}>
            <CardContent className="flex items-center gap-4">
              <div
                className="w-10 h-10 border-2 border-white rounded-full shadow-sm"
                style={{ backgroundColor: ribbon.color }}
              ></div>
              <div className="flex-1">
                <div className="flex gap-2 items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground truncate">
                      {ribbon.name}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {ribbon.color}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {ribbon.price}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Switch checked={ribbon.active} />
                    <div>
                      <CreateEditRibbon ribbon={ribbon} trigger={<EditBtn />} />
                      <DeleteBtn />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    // <ReorderableDataTable
    //   data={wrappings}
    //   getRowId={(row) => row.id}
    //   onReorder={(newWrappings) => {
    //     setWrappings(newWrappings);
    //   }}
    //   rowsCount={wrappings.length}
    //   countUnit="wrappings"
    //   columns={wrappingColumns}
    //   renderCells={(wrapping) => (
    //     <>
    //       <TableCell className="px-4 py-3 text-sm font-medium">
    //         {wrapping.name}
    //       </TableCell>
    //       <TableCell className="px-4 py-3">-</TableCell>
    //       <TableCell className="px-4 py-3">-</TableCell>
    //       <TableCell className="px-4 py-3">
    //         <CreateEditWrapping
    //           wrapping={wrapping}
    //           trigger={
    //             <Button
    //               type="button"
    //               variant="ghost"
    //               className="cursor-pointer"
    //             >
    //               <Pencil className="text-muted-foreground" />
    //             </Button>
    //           }
    //         />
    //         <Button variant="ghost" className="cursor-pointer">
    //           <Trash2 className="text-muted-foreground" />
    //         </Button>
    //       </TableCell>
    //     </>
    //   )}
    // />
  );
}
