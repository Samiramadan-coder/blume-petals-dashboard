"use client";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";

export type DataTableColumn = {
  key: string;
  label: React.ReactNode;
  className?: string;
};

type ReorderableDataTableProps<T> = {
  columns: DataTableColumn[];
  data: T[];
  getRowId: (row: T) => UniqueIdentifier;
  renderCells: (row: T, index: number) => React.ReactNode;
  onReorder?: (rows: T[]) => void;
  rowsCount?: number;
  countUnit?: string;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  page?: number;
  className?: string;
};

function SortableTableRow<T>({
  row,
  index,
  rowId,
  renderCells,
}: {
  row: T;
  index: number;
  rowId: UniqueIdentifier;
  renderCells: (row: T, index: number) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rowId,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(isDragging && "relative z-10 bg-muted opacity-80")}
    >
      <TableCell className="w-10 px-4 py-3">
        <button
          type="button"
          className="cursor-grab text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>

      {renderCells(row, index)}
    </TableRow>
  );
}

export function ReorderableDataTable<T>({
  columns,
  data,
  getRowId,
  renderCells,
  onReorder,
  rowsCount,
  countUnit = "items",
  onNextPage,
  onPreviousPage,
  page = 1,

  className,
}: ReorderableDataTableProps<T>) {
  const dndContextId = useId();
  const t = useTranslations("Common");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const rowIds = data.map(getRowId);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((row) => getRowId(row) === active.id);
    const newIndex = data.findIndex((row) => getRowId(row) === over.id);

    onReorder?.(arrayMove(data, oldIndex, newIndex));
  }

  const footerColSpan = columns.length + 1;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      <DndContext
        id={dndContextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 px-4 py-3" />

              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-sm font-semibold uppercase text-muted-foreground",
                    column.className,
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white">
            <SortableContext
              items={rowIds}
              strategy={verticalListSortingStrategy}
            >
              {data.map((row, index) => {
                const rowId = getRowId(row);

                return (
                  <SortableTableRow
                    key={rowId}
                    row={row}
                    index={index}
                    rowId={rowId}
                    renderCells={renderCells}
                  />
                );
              })}
            </SortableContext>
          </TableBody>

          {rowsCount !== undefined && (
            <TableFooter className="bg-white">
              <TableRow>
                <TableCell
                  className="px-4 py-3 text-sm text-muted-foreground"
                  colSpan={footerColSpan - 1}
                >
                  {rowsCount !== undefined && (
                    <>
                      {t("Showing")}{" "}
                      <span className="font-semibold text-black">
                        {rowsCount ?? data.length}
                      </span>{" "}
                      {countUnit}
                    </>
                  )}
                </TableCell>

                <TableCell className="px-4 py-3">
                  {(onNextPage || onPreviousPage) && (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-xs"
                        onClick={onPreviousPage}
                        disabled={!onPreviousPage}
                      >
                        {t("Previous")}
                      </Button>

                      <Button type="button" className="min-w-8 text-xs">
                        {page}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="text-xs"
                        onClick={onNextPage}
                        disabled={!onNextPage}
                      >
                        {t("Next")}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </DndContext>
    </div>
  );
}
