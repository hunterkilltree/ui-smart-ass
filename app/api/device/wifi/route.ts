import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";

export async function POST(req: Request) {
  const { ssid, password } = await req.json().catch(() => ({}));
  if (!ssid?.trim() || !password || password.length < 8) {
    return NextResponse.json({ error: "Failed to connect" }, { status: 400 });
  }
  const device = store().device;
  device.wifi = {
    ssid,
    signalStrength: -40 - Math.floor(Math.random() * 30),
    ip: `192.168.1.${40 + Math.floor(Math.random() * 60)}`,
  };
  return NextResponse.json({ ssid, connected: true });
}
