import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";
import { requireUser, simulateLatency, unauthorized } from "@/lib/mock/util";

export async function POST(req: Request) {
  await simulateLatency("/api/device/wifi");
  if (!requireUser(req)) return unauthorized();
  const { ssid, password } = await req.json().catch(() => ({}));
  if (typeof ssid !== "string" || !ssid.trim()) {
    return NextResponse.json({ error: "ssid_required" }, { status: 400 });
  }
  // Open networks are allowed (no/empty password). A non-empty password must
  // be at least 8 characters (WPA2 minimum).
  const pass = password == null ? "" : password;
  if (typeof pass !== "string" || (pass.length > 0 && pass.length < 8)) {
    return NextResponse.json(
      { error: "weak_wifi_password" },
      { status: 400 }
    );
  }
  const device = store().device;
  device.wifi = {
    ssid: ssid.trim(),
    signalStrength: -40 - Math.floor(Math.random() * 30),
    ip: `192.168.1.${40 + Math.floor(Math.random() * 60)}`,
  };
  return NextResponse.json({ ssid: ssid.trim(), connected: true });
}
