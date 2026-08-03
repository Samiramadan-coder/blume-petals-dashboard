import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CatalogModule } from "@/types/role-and-permissions";
import { useTranslations } from "next-intl";

export default function Catalog({ catalog }: { catalog: CatalogModule }) {
  const t = useTranslations("RolesAndPermissions");

  return (
    <div className="border border-primary/20 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background">
            <TableHead className="text-xs font-medium uppercase">
              {catalog.key}
            </TableHead>
            <TableHead className="w-16 text-[10px] uppercase">
              {t("View")}
            </TableHead>
            <TableHead className="w-16 text-[10px] uppercase">
              {t("Create")}
            </TableHead>
            <TableHead className="w-16 text-[10px] uppercase">
              {t("Edit")}
            </TableHead>
            <TableHead className="w-16 text-[10px] uppercase">
              {t("Delete")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow className="h-11 bg-white">
            <TableCell></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
