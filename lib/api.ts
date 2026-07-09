// Normalize the base URL once: a trailing slash on NEXT_PUBLIC_API_BASE_URL
// must not produce "https://host//api/..." requests.
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

const DEFAULT_TIMEOUT_MS = 15_000;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

/** Machine-readable failure class, used to pick a localized message in the UI. */
export type ApiErrorCode =
  | "network"
  | "unauthorized"
  | "server"
  | "timeout"
  | "unknown";

export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;
  constructor(status: number, message: string, code?: ApiErrorCode) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code =
      code ??
      (status === 401 ? "unauthorized" : status >= 500 ? "server" : "unknown");
  }
}

/**
 * Called whenever a request comes back 401 on a session-authenticated
 * endpoint (i.e. NOT sign-in/sign-up/forgot-password, where 401 means
 * "bad credentials", not "session expired"). AuthProvider registers a
 * handler that clears the session and redirects to /sign-in.
 *
 * The handler receives the token that was attached to the failed request so
 * it can ignore stale responses from a previous session (e.g. a slow me()
 * call that settles after the user already signed in again).
 */
export type UnauthorizedHandler = (usedToken: string | null) => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(fn: UnauthorizedHandler | null) {
  unauthorizedHandler = fn;
}

/** Endpoints where a 401 means "wrong credentials", not "session expired". */
const CREDENTIAL_PATHS = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export interface ApiOptions extends RequestInit {
  /** Override the default 15s request timeout. */
  timeoutMs?: number;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal: callerSignal, ...init } = options;

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (init.body && !(init.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Default timeout via AbortController, combined with any caller signal.
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const forwardAbort = () => controller.abort();
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort();
    else callerSignal.addEventListener("abort", forwardAbort, { once: true });
  }

  let res: Response;
  let text: string;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    text = await res.text();
  } catch (err) {
    if (timedOut) throw new ApiError(0, "Request timed out", "timeout");
    // Caller-initiated cancellation: propagate as-is so callers (e.g.
    // useQuery cleanup) can recognize and ignore their own aborts.
    if (callerSignal?.aborted) throw err;
    // Offline / DNS / connection refused / CORS — normalize so the UI never
    // has to render a raw browser "Failed to fetch" string.
    throw new ApiError(0, "Network request failed", "network");
  } finally {
    clearTimeout(timer);
    callerSignal?.removeEventListener("abort", forwardAbort);
  }

  let data: unknown = null;
  let parseFailed = false;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      parseFailed = true;
    }
  }

  if (!res.ok) {
    if (
      res.status === 401 &&
      !CREDENTIAL_PATHS.some((p) => path.startsWith(p))
    ) {
      unauthorizedHandler?.(token);
    }
    const msg =
      (data as { error?: string } | null)?.error ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }

  // A 2xx response whose body is not the JSON we expect must not silently
  // resolve to null typed as T.
  if (parseFailed) {
    throw new ApiError(res.status, "Invalid response body", "unknown");
  }
  if (!text) {
    // Explicit no-content success (e.g. 204). Callers expecting a body
    // should treat this as absent data rather than a fake null payload.
    return undefined as T;
  }
  return data as T;
}
