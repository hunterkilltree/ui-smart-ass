import { describe, it } from "vitest";

/*
 * Placeholder spec for the shared data-fetching hook (WS1 in PROPOSAL.md:
 * one useQuery-style hook returning { data, error, loading, refetch } used
 * by all dashboard pages).
 *
 * The hook (lib/useQuery) is being introduced by a concurrent workstream, so
 * these are intentionally `it.todo` — no import of the module yet. The review
 * phase should turn each todo into a real test with renderHook from
 * @testing-library/react and a fake fetcher (vi.fn), then
 * `import { useQuery } from "@/lib/useQuery"`.
 */
describe("lib/useQuery", () => {
  it.todo("starts with loading=true and no data/error");
  it.todo("resolves: exposes data, clears loading, leaves error undefined");
  it.todo("rejects: exposes the error, clears loading, keeps no stale data");
  it.todo("refetch() re-runs the fetcher and replaces data");
  it.todo(
    "ignores stale responses when the query key/params change quickly (logs filter race from audit)"
  );
  it.todo("does not set state after unmount (aborts or ignores in-flight fetches)");
  it.todo("polling option keeps refetching while enabled and stops on unmount");
});
