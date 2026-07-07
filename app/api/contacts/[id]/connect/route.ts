import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const channel = store().channels.find((c) => c.id === id);
  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }
  const { credentials } = await req.json().catch(() => ({ credentials: {} }));
  const missing = channel.credentialFields.filter(
    (f) => !credentials?.[f]?.trim()
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Invalid credentials: missing ${missing.join(", ")}` },
      { status: 400 }
    );
  }
  channel.connected = true;
  channel.error = null;
  return NextResponse.json({ id: channel.id, connected: true });
}
