import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAppUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const nextParam = request.nextUrl.searchParams.get("next");
  const nextPath = nextParam?.startsWith("/") ? nextParam : "/login";
  const appUrl = getAppUrl();

  (await cookies()).delete("token");

  if (!appUrl) {
    // No APP_URL configured: relative redirect, browser resolves against its own origin.
    redirect(nextPath);
  }

  return NextResponse.redirect(new URL(nextPath, appUrl));
}
