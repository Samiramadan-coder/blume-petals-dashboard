"use client";

import { useRouter } from "@/i18n/navigation";
import { deleteToken } from "@/lib/actions";
import { User } from "@/types/shared";
import { LogOut } from "lucide-react";

export default function LogoutBtn({ user }: { user: User }) {
  const router = useRouter();

  return (
    <div
      onClick={async () => {
        await deleteToken();
        router.push("/login");
      }}
      className="cursor-pointer text-muted-foreground mt-auto p-4 border-t border-primary/30 text-xs flex items-center justify-center gap-4"
    >
      <div className="h-8 w-8 rounded-full bg-primary grid place-items-center font-bold">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="mb-1 font-semibold">{user.name}</p>
        <p className="">{user.email}</p>
      </div>
      <LogOut className="size-4" />
    </div>
  );
}
