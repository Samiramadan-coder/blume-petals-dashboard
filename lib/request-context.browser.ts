/**
 * What "#request-context" resolves to in the browser bundle, where there are
 * no request cookies to read. The HTTP client never calls it there: browser
 * requests go through the proxy route, which reads the cookies on the server.
 */
export async function getRequestContext(): Promise<{
  authorization: string;
  language: string | null;
}> {
  throw new Error("getRequestContext() is only available on the server");
}
