import { Pencil } from "lucide-react";
import { Button } from "../ui/button";

export default function EditBtn() {
  return (
    <Button type="button" variant="ghost" className="cursor-pointer">
      <Pencil className="text-muted-foreground" />
    </Button>
  );
}
