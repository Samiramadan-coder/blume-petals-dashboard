import { cookies } from "next/headers";

/**
 * Auth and language headers for an API request, read from the request cookies.
 * Server only: the token cookie is HTTP-only, so this is deliberately not a
 * Server Action and must never be made callable from the browser.
 */
export async function getRequestContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  return {
    authorization: token ? `Bearer ${token}` : "",
    language: cookieStore.get("NEXT_LOCALE")?.value || null,
  };
}
