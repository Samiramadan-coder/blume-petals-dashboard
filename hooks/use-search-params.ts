"use client";

import { createQueryStringUrl } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useQueryParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setQueryParam(key: string, value: string) {
    const url = createQueryStringUrl({
      searchParams: searchParams.toString(),
      pathname,
      key,
      value,
    });

    router.push(url);
  }

  return {
    setQueryParam,
  };
}
