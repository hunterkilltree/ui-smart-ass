/**
 * BE communication layer — the single place the app talks to the backend.
 *
 * - Transport: lib/api.ts (base URL from NEXT_PUBLIC_API_BASE_URL, Bearer token,
 *   JSON error normalization).
 * - Every endpoint is a typed function here. Pages/components import from
 *   this file only — never call fetch/api() directly.
 * - When the real BE contract lands, update paths/types here and the whole
 *   app follows.
 */
import { api } from "./api";
import type {
  User,
  Channel,
  VoicePrompt,
  VoiceSample,
  LogEntry,
  DeviceInfo,
} from "./types";

export interface AuthResponse {
  user: User;
  token: string;
}

export const AuthAPI = {
  signUp: (email: string, password: string) =>
    api<AuthResponse>("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signIn: (email: string, password: string) =>
    api<AuthResponse>("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => api<User>("/auth/me"),

  forgotPassword: (email: string) =>
    api<{ ok: boolean }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const ContactsAPI = {
  list: () => api<Channel[]>("/contacts"),

  connect: (id: string, credentials: Record<string, string>) =>
    api<{ id: string; connected: boolean }>(`/contacts/${id}/connect`, {
      method: "POST",
      body: JSON.stringify({ credentials }),
    }),

  disconnect: (id: string) =>
    api<{ id: string; connected: boolean }>(`/contacts/${id}/disconnect`, {
      method: "POST",
    }),
};

export const VoiceAPI = {
  prompts: () => api<VoicePrompt[]>("/voice-training/prompts"),

  samples: () => api<VoiceSample[]>("/voice-training/samples"),

  submitSample: (promptId: string, audio: Blob, filename = "sample.webm") => {
    const form = new FormData();
    form.append("promptId", promptId);
    form.append("audio", audio, filename);
    return api<VoiceSample>("/voice-training/samples", {
      method: "POST",
      body: form,
    });
  },
};

export interface LogsQuery {
  direction?: "in" | "out";
  status?: string;
  limit?: number;
}

export const LogsAPI = {
  list: ({ direction, status, limit = 50 }: LogsQuery = {}) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (direction) params.set("direction", direction);
    if (status) params.set("status", status);
    return api<LogEntry[]>(`/logs?${params}`);
  },
};

export const DeviceAPI = {
  info: () => api<DeviceInfo>("/device"),

  setWifi: (ssid: string, password: string) =>
    api<{ ssid: string; connected: boolean }>("/device/wifi", {
      method: "POST",
      body: JSON.stringify({ ssid, password }),
    }),
};
