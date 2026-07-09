import { Button } from "../ui/button";
import { SheetClose, SheetFooter } from "../ui/sheet";

export default function FormFooter({
  form,
}: {
  form: React.RefObject<HTMLFormElement | null>;
}) {
  return (
    <SheetFooter className="mt-4 border-t border-border bg-white px-4 py-3">
      <div className="flex items-center justify-end gap-2">
        <SheetClose asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 cursor-pointer"
          >
            Cancel
          </Button>
        </SheetClose>
        <Button
          type="submit"
          className="h-10 flex-1 cursor-pointer"
          onClick={() => form.current?.requestSubmit()}
        >
          Save
        </Button>
      </div>
    </SheetFooter>
  );
}
