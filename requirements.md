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
All endpoints served from a local mock (e.g. `/app/api/mock/*` route handlers, or MSW). Base path: `/api`.

### Auth
```
POST /api/auth/sign-up
  body: { email: string, password: string }
  200: { user: { id: string, email: string, role: "user"|"developer" }, token: string }
  400: { error: string }

POST /api/auth/sign-in
  body: { email: string, password: string }
  200: { user: { id, email, role }, token: string }
  401: { error: "Invalid credentials" }

GET /api/auth/me
  header: Authorization: Bearer <token>
  200: { id, email, role }
```

### Contacts
```
GET /api/contacts
  200: [
    { id: "zalo", name: "Zalo", connected: true, credentialFields: ["oaId","accessToken"] },
    { id: "messenger", name: "Messenger", connected: false, credentialFields: ["pageId","pageAccessToken"] }
  ]

POST /api/contacts/:id/connect
  body: { credentials: { [field: string]: string } }
  200: { id, connected: true }
  400: { error: "Invalid credentials" }

POST /api/contacts/:id/disconnect
  200: { id, connected: false }
```

### Voice Training
```
GET /api/voice-training/prompts
  200: [
    { id: "p1", text_vi: "Xin chào, tôi là trợ lý ảo thông minh.", text_en: "Hello, I am your smart virtual assistant." },
    { id: "p2", text_vi: "Hôm nay thời tiết thế nào?", text_en: "How is the weather today?" },
    { id: "p3", text_vi: "Vui lòng bật đèn phòng khách.", text_en: "Please turn on the living room light." }
  ]

POST /api/voice-training/samples
  multipart/form-data: { promptId: string, audio: File }
  200: { id: string, promptId: string, status: "pending", createdAt: string }

GET /api/voice-training/samples
  200: [
    { id: "s1", promptId: "p1", status: "processed", createdAt: "..." },
    { id: "s2", promptId: "p2", status: "pending", createdAt: "..." }
  ]
```

### Logs (developer only)
```
GET /api/logs?direction=in|out&status=&limit=50
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
```

### Device Config
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
  body: { ssid: string, password: string }
  200: { ssid, connected: true }
  400: { error: "Failed to connect" }
```

## 6. Non-functional
- Responsive (desktop + mobile)
- Vercel-deployable, env-based API base URL (`NEXT_PUBLIC_API_BASE_URL`) to swap mock → real BE
- Language preference persisted (cookie/localStorage)

## 7. Still open
- Real backend contract may differ from mock — mock is a placeholder to unblock FE build.
- Live device status: WebSocket/SSE vs polling — not yet decided, mock uses simple GET (polling-friendly).
