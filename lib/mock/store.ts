// In-memory mock store kept on globalThis. Resets on server restart / new
// serverless instance — fine for FE development. Time-based behavior must be
// derived lazily on read (no timers): see resolveSampleStatus below.
import type { Channel, VoiceSample, LogEntry, DeviceInfo } from "../types";
import { hashString } from "./util";

const g = globalThis as unknown as { __mockStore?: MockStore };

interface MockStore {
  channels: Channel[];
  samples: VoiceSample[];
  logs: LogEntry[];
  device: DeviceInfo;
}

function seed(): MockStore {
  const now = Date.now();
  return {
    channels: [
      {
        id: "zalo",
        name: "Zalo",
        connected: true,
        credentialFields: ["oaId", "accessToken"],
      },
      {
        id: "messenger",
        name: "Messenger",
        connected: false,
        credentialFields: ["pageId", "pageAccessToken"],
      },
      {
        id: "telegram",
        name: "Telegram",
        connected: false,
        credentialFields: ["botToken"],
      },
    ],
    samples: [
      {
        id: "s0",
        promptId: "p3",
        status: "failed",
        failureReason: "audio_unclear",
        lang: "vi",
        createdAt: new Date(now - 2 * 86400000).toISOString(),
      },
      {
        id: "s1",
        promptId: "p1",
        status: "processed",
        lang: "vi",
        createdAt: new Date(now - 86400000).toISOString(),
      },
      {
        id: "s2",
        promptId: "p2",
        status: "pending",
        lang: "vi",
        createdAt: new Date(now - 3600000).toISOString(),
      },
    ],
    // 60 entries (> the API's 50-entry cap) so the UI's "showing first 50" hint is exercisable
    logs: Array.from({ length: 60 }, (_, i) => {
      const isIn = i % 2 === 0;
      const ok = i % 7 !== 0;
      return {
        id: `log${i + 1}`,
        direction: (isIn ? "in" : "out") as "in" | "out",
        endpoint: isIn
          ? ["/model/infer", "/device/heartbeat", "/voice/upload"][i % 3]
          : ["/notify/zalo", "/notify/messenger", "/webhook/reply"][i % 3],
        status: ok ? 200 : [400, 500, 401][i % 3],
        timestamp: new Date(now - i * 9 * 60000).toISOString(),
        payload: isIn
          ? { deviceId: "esp32-001", seq: 1000 + i, text: "xin chào" }
          : { to: "user_123", message: `reply #${i}` },
        response: ok
          ? { ok: true, latencyMs: 40 + (i % 20) * 7 }
          : { ok: false, error: "upstream error" },
      };
    }),
    device: {
      model: "ESP32-S3-AI-Box",
      firmwareVersion: "1.4.2",
      wifi: { ssid: "HomeNet", signalStrength: -55, ip: "192.168.1.42" },
      components: [
        { name: "microphone", status: "online" },
        { name: "speaker", status: "online" },
        { name: "camera", status: "offline" },
        { name: "temp_sensor", status: "error" },
        { name: "led", status: "online" },
      ],
    },
  };
}

export function store(): MockStore {
  if (!g.__mockStore) g.__mockStore = seed();
  return g.__mockStore;
}

/** How long a submitted sample stays "pending" before it resolves. */
export const SAMPLE_PROCESSING_MS = 8000;

/**
 * Lazy, serverless-safe status transition: instead of a setTimeout mutating
 * state in the background (which dies on Vercel), the final status is derived
 * on read from the sample's age. Deterministic — a fixed subset of ids
 * (hash(id) % 5 === 0) fails with a failureReason — so every serverless
 * instance computes the same answer. Mutates the stored sample in place so
 * repeated reads within one instance stay consistent.
 */
export function resolveSampleStatus(sample: VoiceSample): VoiceSample {
  if (sample.status !== "pending") return sample;
  const age = Date.now() - Date.parse(sample.createdAt);
  if (Number.isNaN(age) || age < SAMPLE_PROCESSING_MS) return sample;
  if (hashString(sample.id) % 5 === 0) {
    sample.status = "failed";
    sample.failureReason = "audio_unclear";
  } else {
    sample.status = "processed";
  }
  return sample;
}

export const PROMPTS = [
  {
    id: "p1",
    text_vi: "Xin chào, tôi là trợ lý ảo thông minh.",
    text_en: "Hello, I am your smart virtual assistant.",
  },
  {
    id: "p2",
    text_vi: "Hôm nay thời tiết thế nào?",
    text_en: "How is the weather today?",
  },
  {
    id: "p3",
    text_vi: "Vui lòng bật đèn phòng khách.",
    text_en: "Please turn on the living room light.",
  },
  {
    id: "p4",
    text_vi: "Đặt báo thức lúc bảy giờ sáng mai.",
    text_en: "Set an alarm for seven o'clock tomorrow morning.",
  },
  {
    id: "p5",
    text_vi: "Phát bài hát yêu thích của tôi.",
    text_en: "Play my favorite song.",
  },
];
