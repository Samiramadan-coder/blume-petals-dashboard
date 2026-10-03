import { redirect } from "next/navigation";
// Resolves to the cookie reader on the server and to a stub in the browser
// bundle, see "imports" in package.json.
import { getRequestContext } from "#request-context";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig extends Omit<RequestInit, "method" | "body"> {
  params?: Record<string, string | number | boolean>;
}

interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  ok: boolean;
}

class HttpError extends Error {
  status: number;
  data: unknown;
  method: HttpMethod;
  url: string;

  constructor(
    message: string,
    status: number,
    data: unknown,
    method: HttpMethod,
    url: string,
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
    this.method = method;
    this.url = url;
  }
}

// 422 Validation Error
class ValidationError extends Error {
  status: 422;
  errors: Record<string, string[]>;

  constructor(data: unknown) {
    super("Validation failed");
    this.name = "ValidationError";
    this.status = 422;
    this.errors = ValidationError.parseErrors(data);
  }

  private static parseErrors(data: unknown): Record<string, string[]> {
    if (
      data !== null &&
      typeof data === "object" &&
      "errors" in data &&
      typeof (data as Record<string, unknown>).errors === "object"
    ) {
      return (data as { errors: Record<string, string[]> }).errors;
    }
    return {};
  }
}

// 403 Forbidden Error
class ForbiddenError extends Error {
  status: 403;
  data: unknown;

  constructor(data: unknown) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as Record<string, unknown>).message === "string"
        ? (data as { message: string }).message
        : "You don't have permission to access this resource";

    super(message);
    this.name = "ForbiddenError";
    this.status = 403;
    this.data = data;
  }
}

// 5xx Server Errors
class ServerError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as Record<string, unknown>).message === "string"
        ? (data as { message: string }).message
        : "Internal server error occurred";

    super(message);
    this.name = "ServerError";
    this.status = status;
    this.data = data;
  }
}

/** Route that forwards browser requests to the API, see app/api/proxy. */
const API_PROXY_PREFIX = "/api/proxy";

function buildUrl(
  baseURL: string,
  path: string,
  params?: Record<string, string | number | boolean>,
): string {
  const url = new URL(path, baseURL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

function createHttp(baseURL: string) {
  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  async function handleUnauthorized(): Promise<never> {
    const logoutUrl = "/api/auth/logout?next=/login";

    if (typeof window === "undefined") {
      redirect(logoutUrl);
    }

    window.location.replace(logoutUrl);

    return new Promise<never>(() => {});
  }

  function isSerializableBody(body: unknown): body is BodyInit {
    return (
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof Blob ||
      body instanceof ArrayBuffer ||
      ArrayBuffer.isView(body) ||
      body instanceof ReadableStream ||
      typeof body === "string"
    );
  }

  async function request<T = unknown>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    config: RequestConfig = {},
  ): Promise<HttpResponse<T>> {
    const { params, headers: extraHeaders, ...restConfig } = config;

    // The token is in an HTTP-only cookie, so the browser cannot call the API
    // itself: it goes through the same-origin proxy route, which adds the
    // Authorization and Accept-Language headers on the server.
    const isBrowser = typeof window !== "undefined";

    const url = isBrowser
      ? buildUrl(window.location.origin, API_PROXY_PREFIX + path, params)
      : buildUrl(baseURL, path, params);

    const headers = new Headers();
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    if (extraHeaders) {
      new Headers(extraHeaders).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    // In the browser the proxy route attaches these from the cookies.
    if (!isBrowser) {
      const { authorization, language } = await getRequestContext();

      headers.set("Authorization", authorization);

      if (language) {
        headers.set("Accept-Language", language);
      }
    }

    let requestBody: BodyInit | undefined;

    if (body !== undefined) {
      if (isSerializableBody(body)) {
        requestBody = body;
      } else {
        requestBody = JSON.stringify(body);
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
      }

      if (body instanceof FormData) {
        headers.delete("Content-Type");
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
      ...restConfig,
    });

    let data: unknown;
    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        await handleUnauthorized();
      }

      if (response.status === 403) {
        throw new ForbiddenError(data);
      }

      if (response.status === 422) {
        throw new ValidationError(data);
      }

      if (response.status >= 500 && response.status < 600) {
        throw new ServerError(response.status, data);
      }

      throw new HttpError(
        `${method} ${url} failed with status ${response.status}`,
        response.status,
        data,
        method,
        url,
      );
    }

    return { data: data as T, status: response.status, ok: response.ok };
  }

  return {
    get<T = unknown>(path: string, config?: RequestConfig) {
      return request<T>("GET", path, undefined, config);
    },
    post<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
      return request<T>("POST", path, body, config);
    },
    put<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
      return request<T>("PUT", path, body, config);
    },
    patch<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
      return request<T>("PATCH", path, body, config);
    },
    delete<T = unknown>(path: string, config?: RequestConfig) {
      return request<T>("DELETE", path, undefined, config);
    },
    /** Set or update a default header (e.g. Authorization token) */
    setHeader(key: string, value: string) {
      defaultHeaders[key] = value;
    },
    /** Remove a default header */
    removeHeader(key: string) {
      delete defaultHeaders[key];
    },
  };
}

const http = createHttp(process.env.NEXT_PUBLIC_API_URL ?? "");

/**
 * Extract the backend's message from a failed 4xx request, if it sent one.
 * 5xx messages are skipped on purpose, they are not meant for the user.
 */
function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof ForbiddenError) {
    return error.message;
  }

  if (error instanceof ValidationError) {
    return Object.values(error.errors)[0]?.[0];
  }

  if (
    error instanceof HttpError &&
    error.data !== null &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return undefined;
}

export {
  http,
  API_PROXY_PREFIX,
  createHttp,
  getErrorMessage,
  HttpError,
  ValidationError,
  ForbiddenError,
  ServerError,
};
export type { HttpResponse, RequestConfig };
