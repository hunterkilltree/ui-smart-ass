"use client";

/**
 * Small shared data-fetching layer — the ONE way pages load and mutate data.
 *
 * useQuery guarantees:
 * - stale responses are ignored when deps change or the component unmounts;
 * - previous data is kept during a refetch (loading is only true before the
 *   first data arrives; background refetches set `refreshing` instead);
 * - a failed poll keeps the last good data and exposes `error`;
 * - polling pauses while the tab is hidden (unless pollWhenHidden) and
 *   resumes with an immediate refetch when it becomes visible again.
 *
 * useMutation guarantees double-submit protection and captured errors
 * (mutate never throws / never leaves an unhandled rejection).
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseQueryOptions {
  /** Refetch every pollMs milliseconds. */
  pollMs?: number;
  /** Keep polling while the tab is hidden (default: pause when hidden). */
  pollWhenHidden?: boolean;
}

export interface UseQueryResult<T> {
  data: T | undefined;
  error: unknown;
  /** True only while loading with no data yet (first load / after deps reset). */
  loading: boolean;
  /** True while refetching in the background with previous data still shown. */
  refreshing: boolean;
  refetch: () => Promise<void>;
  /** Locally override the cached data (e.g. after a successful mutation). */
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

export function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  opts: UseQueryOptions = {}
): UseQueryResult<T> {
  const { pollMs, pollWhenHidden = false } = opts;

  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown>(null);
  const [pending, setPending] = useState(true);

  // Always call the latest fetcher without re-triggering effects.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Monotonic request id: responses that do not match the latest id are
  // stale (deps changed, refetch superseded, or unmounted) and are dropped.
  const reqIdRef = useRef(0);

  const refetch = useCallback(async () => {
    const id = ++reqIdRef.current;
    setPending(true);
    try {
      const result = await fetcherRef.current();
      if (id !== reqIdRef.current) return; // stale — ignore
      setData(result);
      setError(null);
    } catch (err) {
      if (id !== reqIdRef.current) return; // stale — ignore
      setError(err); // keep last good data
    } finally {
      if (id === reqIdRef.current) setPending(false);
    }
  }, []);

  // Fetch on mount and whenever deps change.
  useEffect(() => {
    void refetch();
    const reqId = reqIdRef; // stable ref object — safe to bump in cleanup
    return () => {
      // Invalidate in-flight requests on deps change / unmount.
      reqId.current++;
    };
    // The caller-provided deps array is the dependency list by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Optional polling.
  useEffect(() => {
    if (!pollMs) return;
    const tick = () => {
      if (!pollWhenHidden && document.hidden) return; // paused while hidden
      void refetch();
    };
    const timer = setInterval(tick, pollMs);
    const onVisibility = () => {
      // Back to visible: resume with an immediate refetch.
      if (!document.hidden) void refetch();
    };
    if (!pollWhenHidden) {
      document.addEventListener("visibilitychange", onVisibility);
    }
    return () => {
      clearInterval(timer);
      if (!pollWhenHidden) {
        document.removeEventListener("visibilitychange", onVisibility);
      }
    };
  }, [pollMs, pollWhenHidden, refetch]);

  return {
    data,
    error,
    loading: pending && data === undefined,
    refreshing: pending && data !== undefined,
    refetch,
    setData,
  };
}

export interface UseMutationResult<TArgs, TRes> {
  /**
   * Run the mutation. Never throws: on failure it captures the error (see
   * `error`) and resolves to undefined. Calls made while busy are ignored
   * (double-submit protection) and also resolve to undefined.
   */
  mutate: (args: TArgs) => Promise<TRes | undefined>;
  busy: boolean;
  error: unknown;
  /** Clear the captured error (e.g. when the user dismisses it). */
  reset: () => void;
}

export function useMutation<TArgs = void, TRes = unknown>(
  fn: (args: TArgs) => Promise<TRes>
): UseMutationResult<TArgs, TRes> {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fnRef = useRef(fn);
  fnRef.current = fn;
  // Synchronous guard — state updates are async, so a ref is what actually
  // blocks a double click in the same tick.
  const busyRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(async (args: TArgs): Promise<TRes | undefined> => {
    if (busyRef.current) return undefined; // ignore double submits
    busyRef.current = true;
    setBusy(true);
    setError(null);
    try {
      return await fnRef.current(args);
    } catch (err) {
      if (mountedRef.current) setError(err);
      return undefined;
    } finally {
      busyRef.current = false;
      if (mountedRef.current) setBusy(false);
    }
  }, []);

  const reset = useCallback(() => setError(null), []);

  return { mutate, busy, error, reset };
}
