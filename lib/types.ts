export type Role = "user" | "developer";

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface Channel {
  id: string;
  name: string;
  connected: boolean;
  credentialFields: string[];
  error?: string | null;
}

export interface VoicePrompt {
  id: string;
  text_vi: string;
  text_en: string;
}

export type SampleStatus = "pending" | "processed" | "failed";

export interface VoiceSample {
  id: string;
  promptId: string;
  status: SampleStatus;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  direction: "in" | "out";
  endpoint: string;
  status: number;
  timestamp: string;
  payload: unknown;
  response: unknown;
}

export type ComponentStatus = "online" | "offline" | "error";

export interface DeviceComponent {
  name: string;
  status: ComponentStatus;
}

export interface DeviceInfo {
  model: string;
  firmwareVersion: string;
  wifi: { ssid: string; signalStrength: number; ip: string };
  components: DeviceComponent[];
}
