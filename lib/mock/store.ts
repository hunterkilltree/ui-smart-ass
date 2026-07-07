// In-memory mock store. Resets on server restart — fine for FE development.
import type { Channel, VoiceSample, LogEntry, DeviceInfo } from "../types";

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
        id: "s1",
        promptId: "p1",
        status: "processed",
        createdAt: new Date(now - 86400000).toISOString(),
      },
      {
        id: "s2",
        promptId: "p2",
        status: "pending",
        createdAt: new Date(now - 3600000).toISOString(),
      },
    ],
    logs: Array.from({ length: 40 }, (_, i) => {
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
