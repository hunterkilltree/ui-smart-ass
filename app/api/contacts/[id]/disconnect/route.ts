import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const channel = store().channels.find((c) => c.id === id);
  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }
  channel.connected = false;
  return NextResponse.json({ id: channel.id, connected: false });
}
