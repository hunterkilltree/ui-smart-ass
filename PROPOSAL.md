# UI/UX & Logic Improvement Proposal

**Repo:** Smart AI Assistant Hub — Next.js 15 control hub for the SEN ESP32 assistant ("Người bạn đồng hành AI cho người lớn tuổi" — an AI companion for elderly users).

**How this was produced:** a 20-agent audit (9 dimension reviewers → adversarial verifiers → completeness critic) over the whole codebase, cross-checked by running the app and driving every flow in a live browser (desktop + mobile viewports). 106 findings survived verification: **14 high, 44 medium, 48 low**. This document groups them into 7 workstreams with a suggested sequence.

**The headline pattern:** the happy path is genuinely well built — requirements v2 is ~90% faithfully implemented, the endpoint layer is cleanly centralized in `lib/be.ts`, the recorder lifecycle mostly cleans up after itself, and i18n coverage of static text is near-total. What's systematically missing is everything *off* the happy path: nearly every failure path is silent, invisible, or actively destructive, and the app is almost entirely silent to assistive technology — a serious issue given the product's elderly target audience.

---

## WS1 — Make failure visible (logic; highest priority)

Every data mutation and most fetches swallow errors. Verified examples:

| Issue | Where | Severity |
|---|---|---|
| Voice submit has `try/finally` with no `catch` — failed upload = unhandled rejection, zero user feedback, recording kept but UI can't tell | `app/dashboard/voice-training/page.tsx:103` | high |
| `disconnect()` has no error handling and no in-flight guard | `app/dashboard/contacts/page.tsx:46` | high |
| Failed contacts fetch renders as an empty page (`.catch(() => setChannels([]))`) — indistinguishable from "no channels" | `app/dashboard/contacts/page.tsx:19` | high |
| Device fetch failure = infinite spinner forever | `app/dashboard/device/page.tsx` | high |
| Logs fetch failure renders the "no matching logs" empty state | `app/dashboard/logs/page.tsx:32` | medium |
| One failed samples poll wipes history to "No samples yet" **and permanently kills polling** | `voice-training/page.tsx:27-45` | medium |
| Prompts fetch failure renders a recordable card with an empty quoted sentence and a no-op Submit | `voice-training/page.tsx:116-147` | medium |
| Network failures bypass `ApiError` — users see raw `Failed to fetch` | `lib/api.ts:33` | medium |
| No 401 handling anywhere: expired token mid-session = silently empty dashboard | `lib/api.ts` + `lib/auth.tsx` | medium |
| Transient `me()` failure on load deletes the session token (network blip = logout) | `lib/auth.tsx:35-38` | medium |
| Stale-response race when changing log filters quickly | `app/dashboard/logs/page.tsx` | medium |
| `reset()` after `await` in voice submit can clobber a newer recording; mic can stay live behind an "idle" UI | `voice-training/page.tsx:103-114` | medium |
| Unmount cleanup captures stale `audioUrl` (always null) — object URLs leak on navigation | `voice-training/page.tsx:47-53` | medium |

**Root cause (per the completeness critic):** there is no data-fetching layer — five hand-rolled `useEffect` fetchers, each with a different (usually wrong) error policy.

**Proposed work:**
1. Wrap `fetch` in `lib/api.ts` to normalize network failures into `ApiError`; special-case 401 → clear token + redirect to sign-in (distinguish network vs 401 in the boot-time `me()` call so a blip doesn't log the user out).
2. Introduce one small `useQuery`-style hook (or adopt TanStack Query) with `{data, error, loading, refetch}` and use it on all five pages — this single change fixes the divergent error handling, the stale-filter race, and the dead-polling bug at once.
3. Add `catch` + error UI to every mutation (voice submit, connect, disconnect, Wi-Fi change).

## WS2 — Feedback & destructive-action UX

- **Disconnect fires instantly with no confirmation** (high) — destructive: reconnecting requires re-entering all credentials. Add a confirm dialog (Modal + danger Button already exist).
- **No toast/feedback primitive** (high) — mutation outcomes are communicated four different ways, including not at all (disconnect, connect success). Add one `Toast`/`useToast` and standardize.
- **Modal** (`components/ui.tsx:135`): no Escape close, no scroll lock, no close button, and a backdrop click silently discards typed credentials mid-form (verified live). Fix the primitive once — both dialogs benefit.
- **Button `loading` prop** — the busy-label pattern is hand-rolled in 6 places with inconsistent disabled styling.
- Wi-Fi modal retains typed password + stale error across close/reopen; success banner never resets; Wi-Fi and channel-token fields need `type="password"`/show-hide toggles (secrets are currently plain text — verified live).

## WS3 — Accessibility (critical for this product's elderly audience)

Verified live: not a single `aria-live`, `role="alert"`, `aria-current`, `aria-expanded`, or `aria-pressed` exists in the codebase.

- `<html lang="vi">` is static — switching to EN leaves Vietnamese pronunciation for screen readers (high; confirmed in browser: lang stays `vi` after switch).
- Alerts never announced — add `role="alert"`/`aria-live` to the `Alert` primitive (high).
- Voice recording is silent to screen readers and drops keyboard focus when the Record/Stop buttons unmount (high).
- Modal lacks `role="dialog"`, `aria-modal`, focus trap (high; confirmed via accessibility snapshot).
- Focus-visible styles missing on Button (all variants), nav links, icon buttons, log-row expander, language switcher. (Note: Input and the logs select *do* have indicators — scope the fix to the real gaps.)
- AA contrast failures: `slate-400` at `text-xs` (~2.6:1), lotus-pink tagline, `slate-500` on cream background.
- **Typography defeats its own design**: `globals.css` sets a senior-friendly 17px base, then nearly all content renders at `text-sm`/`text-xs`. Rebase content to 16–17px.
- Smaller: `aria-current` on tabs, `aria-expanded` on log rows, language-switcher pressed state + 44px touch targets, `role="status"` on Spinner, Input error not linked via `aria-describedby`, id derived from label text.

## WS4 — Requirements gaps (spec §3–§6)

- **Logs time filter is missing** — explicit §4 violation; the gap runs through UI, `LogsQuery`, and the mock handler. (An unused `time` i18n key already exists.)
- The required contacts **"error" status is unreachable dead code** — mock never produces it and the UI never shows `channel.error`.
- **Forgot-password is half a flow** — no reset-password route/endpoint exists; it's a dead end.
- **Mock breaks on Vercel** (§6 requires Vercel-deployable): `setTimeout` status transitions + non-`globalThis` assumptions die on serverless. Swap to lazy status transition computed on read (e.g. `createdAt + 10s → processed`).
- Voice sample submissions don't record which language variant was read — the training data is ambiguous. Add `lang` to the sample POST.
- Wi-Fi form's 8+ char password rule makes open networks unconfigurable.

## WS5 — i18n hardening

- **All runtime errors reach users in English** (high) — server strings and the `Request failed (N)` fallback bypass the dictionary. Introduce error *codes* in `ApiError` mapped to i18n keys.
- Dates use browser locale, not app language (verified live: `7/9/2026, 5:14:08 PM` shown in Vietnamese UI). Use `Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-US', …)` everywhere a date renders.
- English-preference users get a Vietnamese flash every load (preference read post-hydration) — read from localStorage in a pre-hydration inline script or cookie.
- Raw API identifiers as user-facing labels: `pageId`, `pageAccessToken`, `oaId`, `botToken` (verified live), plus raw role badge (`developer`), Vietnamese-only tab title/metadata, hardcoded `SSID` label.

## WS6 — Mobile & visual polish

- **Tab nav breaks on mobile** (verified live): the bar overflows and the *active* tab can be scrolled fully out of view with no indication. Auto-scroll active tab into view (`scrollIntoView` on route change) + stronger active styling; consider a bottom tab bar on mobile for this audience.
- User identity/role entirely hidden on mobile header.
- Skeleton cards instead of full-page spinners; `EmptyState` and `Select` primitives; dedupe brand tokens (two different "success greens"); declare `color-scheme`.

## WS7 — Engineering foundations (completeness critic)

- No `error.tsx` / `not-found.tsx` anywhere — any render throw or bad URL yields Next's default unbranded screen.
- **Zero tests, broken lint** (`next lint` configured but ESLint isn't installed), no CI. Minimum: install ESLint, add Vitest + Testing Library, a GitHub Actions workflow running lint + typecheck + test + build.
- No `getUserMedia`/`MediaRecorder` feature detection — on insecure origins or unsupported browsers the core feature fails with a misleading "grant mic permission" message (verified live: clicking Record while permission is undecided gives *no* feedback at all). Detect + differentiate messages + add a "requesting permission…" state.
- Recording UX for the core product loop: elapsed-time indicator, min/max duration guards, retry affordance on failed samples, fix the shuffle-icon-vs-sequential mismatch.
- Mock realism/security (low priority, mock-only): auth-check all endpoints (only 2 of 12 verify the token), simulated latency/failures, remove the "email containing dev = developer role" hint from the sign-in page before any real deployment.

---

## Suggested sequencing

| Phase | Scope | Contents |
|---|---|---|
| **1 — Stop the silent failures** | ~1–2 days | WS1 items 1+3 (transport normalization, 401 handling, catch+error UI on all mutations), disconnect confirmation, toast primitive, device/logs/contacts error states |
| **2 — A11y + requirements** | ~2 days | WS3 highs (lang sync, aria-live, dialog semantics, focus-visible, recording announcements), logs time filter, reachable error status, serverless-safe mock, typography rebase |
| **3 — Refactor + polish** | ~2–3 days | `useQuery` hook migration (WS1 item 2), i18n error codes + Intl dates + flash fix, mobile tab nav, voice recording UX (timer/limits/retry), reset-password flow |
| **4 — Foundations** | ~1–2 days | Error boundaries, ESLint fix, Vitest + CI, feature detection, empty-state/skeleton primitives |

Full machine-readable findings (all 106 with file:line, verifier evidence, and per-finding proposals) are preserved in the audit output; ask and they can be exported into the repo or a tracker.
