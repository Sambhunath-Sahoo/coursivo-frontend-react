/**
 * The single place the ApiResponse envelope is unwrapped.
 *
 * Constraint: every backend response is { metaData: { success, message }, data }. This
 * module throws HttpError when the HTTP status is not ok OR metaData.success is false,
 * and returns json.data on success — so nothing downstream ever sees the envelope, and
 * the service functions in api/*.service.ts return payloads directly. A backend endpoint
 * that returns a raw object instead of ApiResponse.ok(...) breaks every caller even on
 * HTTP 200.
 *
 * The Bearer token is attached here from localStorage; do not set Authorization inside
 * services. API_URL must keep its trailing slash, because callers pass bare relative
 * paths like api.get("courses").
 */
import type { ApiResponse } from "@/types/auth.types";
import { storage, STORAGE_KEYS } from "@/lib/storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/";

interface HttpOptions extends RequestInit {
  token?: string;
}

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

async function http<T>(
  endpoint: string,
  options: HttpOptions = {},
): Promise<T> {
  const { token: providedToken, ...fetchOptions } = options;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // Automatically add token from storage if not provided
  const token = providedToken || storage.getString(STORAGE_KEYS.TOKEN);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.metaData?.success) {
    throw new HttpError(
      json.metaData?.message || "An error occurred",
      response.status,
    );
  }

  return json.data;
}

// HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: HttpOptions) =>
    http<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: HttpOptions) =>
    http<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: HttpOptions) =>
    http<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: HttpOptions) =>
    http<T>(endpoint, { ...options, method: "DELETE" }),
};

export { HttpError };
