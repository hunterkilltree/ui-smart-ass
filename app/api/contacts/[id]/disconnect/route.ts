import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";
import { requireUser, simulateLatency, unauthorized } from "@/lib/mock/util";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await simulateLatency("/api/contacts/disconnect");
  if (!requireUser(req)) return unauthorized();
  const { id } = await params;
  const channel = store().channels.find((c) => c.id === id);
  if (!channel) {
    return NextResponse.json({ error: "channel_not_found" }, { status: 404 });
  }
  channel.connected = false;
  channel.error = null;
  return NextResponse.json({ id: channel.id, connected: false });
}
