import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";

export default function NavigationTabs() {
  return (
    <div className="p-1 my-4 w-fit border border-border rounded-xl">
      <Link href="/templates">
        <Button className="rounded-lg text-xs font-semibold" variant="ghost">
          Templates
        </Button>
      </Link>

      <Link href="/templates/ribbons-cards">
        <Button className="rounded-lg text-xs font-semibold" variant="ghost">
          Ribbons & Cards
        </Button>
      </Link>
    </div>
  );
}
