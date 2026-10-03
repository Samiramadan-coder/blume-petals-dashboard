import { NextRequest } from "next/server";
import { API_PROXY_PREFIX } from "@/lib/http";
import { getRequestContext } from "@/lib/request-context";

/**
 * Same-origin proxy for API requests made from the browser. The token lives
 * in an HTTP-only cookie the browser cannot read, so the request is sent here
 * and the Authorization / Accept-Language headers are attached on the server.
 * The API response (status and body) is passed through untouched.
 */
async function forward(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return Response.json(
      { message: "NEXT_PUBLIC_API_URL is not configured" },
      { status: 500 },
    );
  }

  // Taken from the raw pathname so the encoding of each segment is preserved.
  // Assigned onto the API URL instead of resolved against it, so a path such
  // as "//other-host/x" can never change the host the token is sent to.
  const url = new URL(apiUrl);
  url.pathname = request.nextUrl.pathname.slice(API_PROXY_PREFIX.length);
  url.search = request.nextUrl.search;

  const headers = new Headers();

  // Content-Type carries the multipart boundary, it has to go through as is.
  for (const name of ["accept", "content-type"]) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  const { authorization, language } = await getRequestContext();

  headers.set("Authorization", authorization);

  // Without a locale cookie, keep the browser's own header like a direct
  // browser request to the API would have sent.
  const acceptLanguage = language ?? request.headers.get("accept-language");

  if (acceptLanguage) {
    headers.set("Accept-Language", acceptLanguage);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  let response: Response;

  try {
    response = await fetch(url, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      cache: "no-store",
      redirect: "manual",
      // Required by Node to send a streamed body.
      ...(hasBody ? { duplex: "half" } : {}),
    } as RequestInit);
  } catch (error) {
    console.error(`API proxy: ${request.method} ${url} did not respond:`, error);

    return Response.json(
      { message: "The API could not be reached" },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();

  // fetch() already decoded the body, so the encoding/length are not copied.
  for (const name of ["content-type", "content-disposition", "retry-after"]) {
    const value = response.headers.get(name);
    if (value) {
      responseHeaders.set(name, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
};
