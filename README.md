# Smart AI Assistant Hub — Frontend

Next.js (App Router) control hub for an ESP32-based smart AI assistant. Implements requirements v2 (`requirements.md`).

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/sign-in`.

## Mock auth rules

The built-in mock API accepts any email + any password ≥ 6 chars.

- Email containing `dev` (e.g. `dev@example.com`) → **developer** role → sees the **Logs** tab
- Any other email → **user** role

## Features

- **Auth**: standalone `/sign-in`, `/sign-up`, `/forgot-password` pages; protected `/dashboard/*` routes (redirect to sign-in when unauthenticated)
- **Contacts tab**: connect/disconnect channels (Zalo, Messenger, Telegram) with per-channel credential forms and status badges
- **Voice Training tab**: rotating sample sentence bank, browser mic recording (MediaRecorder), playback, re-record, submit (multipart), sample history with pending/processed/failed status (auto-polls while pending)
- **Logs tab** (developer only): filter by direction/status, expandable raw payload/response viewer
- **Device Config tab**: model/firmware, Wi-Fi info + change-Wi-Fi flow, component health list
- **i18n**: Vietnamese (default) + English, switchable, persisted in localStorage
- Responsive (mobile + desktop), Vercel-deployable

## BE communication

Two layers, both in `lib/`:

- `lib/api.ts` — transport: base URL, Bearer token injection, JSON error normalization (`ApiError`)
- `lib/be.ts` — **the only place endpoints are defined**: typed services `AuthAPI`, `ContactsAPI`, `VoiceAPI`, `LogsAPI`, `DeviceAPI`. All pages call these; nothing else touches `fetch`.

Swapping mock → real backend:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.your-backend.com
```

Empty value (default) = same-origin `/api/*` mock route handlers in `app/api/`. If the real BE contract differs from the mock, adjust paths/types in `lib/be.ts` (and `lib/types.ts`) only.

## Structure

```
app/
  sign-in|sign-up|forgot-password/   standalone auth pages
  dashboard/                         protected layout + 4 tabs
    contacts/ voice-training/ logs/ device/
  api/                               mock BE (route handlers)
components/                          UI primitives, auth shell, language switcher
lib/                                 api client, auth context, i18n, types, mock store
```

## Notes

- Mock token is base64 JSON — not secure, mock only.
- Mock store is in-memory; resets on server restart.
- Live device status uses polling-friendly GET (WebSocket/SSE still open per requirements §7).
