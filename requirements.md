# Smart AI Assistant Hub — Frontend Requirements (v2)

## 1. Overview
A web-based control hub (Next.js, deployable on Vercel) that lets users manage an ESP32-based smart AI assistant device: connect messaging channels, train the voice model, monitor device health, and (for developers) inspect API traffic with the backend.

## 2. Tech Stack
- **Framework:** Next.js (App Router), deployed on Vercel
- **i18n:** Vietnamese (default) + English, user-switchable
- **Auth:** Separate, standalone Sign In / Sign Up pages (not embedded in dashboard layout) — full-page flow, redirects to dashboard on success

## 3. Authentication
- **Sign Up page** (own route, e.g. `/sign-up`): email, password, confirm password
- **Sign In page** (own route, e.g. `/sign-in`): email, password
- Forgot/reset password (own route)
- Protected dashboard routes — redirect to `/sign-in` if not authenticated
- Role field on user: `user` | `developer` (developer role gates the Logs tab)

## 4. Dashboard — Tabbed Layout
After login, user lands on a dashboard with 4 tabs: **Contacts**, **Voice Training**, **Logs** (developer only), **Device Config**.

### Tab 1 — Contact Integrations
- List of channels (Zalo, Messenger, ...) with connect/disconnect
- Per-channel credential form (token/API key/OA ID)
- Status indicator: connected / not connected / error

### Tab 2 — Voice Training
- **Opens microphone recording directly** (browser mic permission prompt on tab entry or "Record" button)
- App shows a **sample/example sentence** for the user to read aloud (rotating prompt bank, not free-form typing first)
- User records → playback → optionally re-record
- On submit: audio + the matched example text sent to backend
- History list of submitted samples with status (pending/processed/failed)

### Tab 3 — Logs (developer role only)
- List of BE request/response events, filterable by direction (in/out), status, time
- Raw payload viewer per entry

### Tab 4 — Device Configuration (ESP32)
- Model/firmware info
- Current Wi-Fi (SSID, signal, IP) + change Wi-Fi flow
- Component health list (mic, speaker, sensors, etc.) with online/offline/error state

## 5. Mock API (for FE development before real BE is ready)
All endpoints served from local route handlers under `app/api/*`. Base path: `/api`.

**Conventions (all endpoints):**
- **Errors are machine-readable codes**, never English prose: `{ error: "<snake_case_code>" }`. The client maps codes to localized copy (vi/en) — codes must never be shown raw to users.
- **Auth:** every endpoint except `/api/auth/*` requires `Authorization: Bearer <token>`. Missing/invalid token → `401 { error: "unauthorized" }`. `/api/logs` additionally requires the `developer` role → otherwise `403 { error: "forbidden" }`.
- **Latency:** every handler adds a deterministic 150–400 ms artificial delay (derived from the path) so loading states are exercised.
- **Serverless-safe state:** the store lives on `globalThis` and uses **no background timers** — time-based transitions (voice-sample processing) are derived lazily on read from `createdAt`, so behavior is identical on Vercel serverless. In-memory state may reset between instances/deploys; the FE must tolerate that.

### Auth (public — no token required)
```
POST /api/auth/sign-up
  body: { email: string, password: string }
  200: { user: { id: string, email: string, role: "user"|"developer" }, token: string }
  400: { error: "invalid_email" | "weak_password" }        // password >= 6 chars
  Mock rules: email containing "dev" → developer role; user id is a stable
  hash of the email (same email always gets the same id).

POST /api/auth/sign-in
  body: { email: string, password: string }
  200: { user: { id, email, role }, token: string }
  401: { error: "invalid_credentials" }                    // password >= 6 chars
  Mock rules: any email signs in; same stable-id and role rules as sign-up.

GET /api/auth/me
  header: Authorization: Bearer <token>
  200: { id, email, role }
  401: { error: "unauthorized" }

POST /api/auth/forgot-password
  body: { email: string }
  200: { ok: true, resetUrl: "/reset-password?token=mock-token" }
  400: { error: "email_required" }
  Mock rules: no email is sent; `resetUrl` is the link the email would
  contain, so the UI can render it as a dev hint.

POST /api/auth/reset-password
  body: { token: string, password: string }
  200: { ok: true }
  400: { error: "invalid_token" | "expired_token" | "weak_password" }
  Mock rules: token "expired" → expired_token; any other non-empty token is
  accepted; password >= 6 chars.
```

### Contacts (auth required)
```
GET /api/contacts
  200: [
    { id: "zalo", name: "Zalo", connected: true, credentialFields: ["oaId","accessToken"], error: null },
    { id: "messenger", name: "Messenger", connected: false, credentialFields: ["pageId","pageAccessToken"], error: "invalid_credentials" }
  ]
  // `error` is a machine-readable code set when the last connect attempt was
  // rejected. Status indicator: connected → "connected"; error → "error";
  // else → "not connected".

POST /api/contacts/:id/connect
  body: { credentials: { [field: string]: string } }
  200: { id, connected: true }
  400: { error: "missing_credentials" }   // any required field empty/absent
  400: { error: "invalid_credentials" }   // provider rejected — see trigger
  404: { error: "channel_not_found" }
  Mock trigger for the error state: submit any credential value equal to
  "bad" or "expired" (e.g. Zalo oaId = "bad") → the channel is persisted as
  { connected: false, error: "invalid_credentials" } so the "error" status
  is reachable and visible in the contacts list.

POST /api/contacts/:id/disconnect
  200: { id, connected: false }           // also clears `error`
  404: { error: "channel_not_found" }
```

### Voice Training (auth required)
```
GET /api/voice-training/prompts
  200: [
    { id: "p1", text_vi: "Xin chào, tôi là trợ lý ảo thông minh.", text_en: "Hello, I am your smart virtual assistant." },
    ...
  ]

POST /api/voice-training/samples
  multipart/form-data: { promptId: string, audio: File, lang?: "vi"|"en" }
  // `lang` records which language variant of the prompt was read aloud.
  200: { id: string, promptId: string, status: "pending", createdAt: string, lang?: "vi"|"en" }
  400: { error: "missing_fields" | "unknown_prompt" | "invalid_lang" }

GET /api/voice-training/samples
  200: [
    { id: "s1", promptId: "p1", status: "processed", createdAt: "...", lang: "vi" },
    { id: "s0", promptId: "p3", status: "failed", failureReason: "audio_unclear", createdAt: "...", lang: "vi" }
  ]
  // Sorted newest first. Status is derived lazily (serverless-safe): a sample
  // younger than 8 s is "pending"; after that it becomes "processed", except
  // a deterministic subset (hash(id) % 5 === 0) becomes "failed" with a
  // machine-readable `failureReason` (currently "audio_unclear").
```

### Logs (auth + developer role required)
```
GET /api/logs?direction=in|out&status=&limit=50&from=<ISO>&to=<ISO>
  200: [
    {
      id: "log1",
      direction: "in",
      endpoint: "/model/infer",
      status: 200,
      timestamp: "2026-07-07T10:00:00Z",
      payload: { ... },
      response: { ... }
    }
  ]
  400: { error: "invalid_limit" }         // limit must be a positive integer
  400: { error: "invalid_time_range" }    // from/to must parse as ISO dates
  401: { error: "unauthorized" }, 403: { error: "forbidden" }
  // `from`/`to` filter on `timestamp`, inclusive; either may be given alone.
```

### Device Config (auth required)
```
GET /api/device
  200: {
    model: "ESP32-S3-AI-Box",
    firmwareVersion: "1.4.2",
    wifi: { ssid: "HomeNet", signalStrength: -55, ip: "192.168.1.42" },
    components: [
      { name: "microphone", status: "online" },
      { name: "speaker", status: "online" },
      { name: "temp_sensor", status: "error" }
    ]
  }

POST /api/device/wifi
  body: { ssid: string, password?: string }
  // Open networks allowed: password may be omitted or empty. A non-empty
  // password must be >= 8 characters (WPA2 minimum).
  200: { ssid, connected: true }
  400: { error: "ssid_required" | "weak_wifi_password" }
```

## 6. Non-functional
- Responsive (desktop + mobile)
- Vercel-deployable, env-based API base URL (`NEXT_PUBLIC_API_BASE_URL`) to swap mock → real BE
- Language preference persisted (cookie/localStorage)

## 7. Still open
- Real backend contract may differ from mock — mock is a placeholder to unblock FE build.
- Live device status: WebSocket/SSE vs polling — not yet decided, mock uses simple GET (polling-friendly).
