import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";
import { requireUser, simulateLatency, unauthorized } from "@/lib/mock/util";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await simulateLatency("/api/contacts/connect");
  if (!requireUser(req)) return unauthorized();
  const { id } = await params;
  const channel = store().channels.find((c) => c.id === id);
  if (!channel) {
    return NextResponse.json({ error: "channel_not_found" }, { status: 404 });
  }
  const { credentials } = await req.json().catch(() => ({ credentials: {} }));
  const missing = channel.credentialFields.filter(
    (f) => typeof credentials?.[f] !== "string" || !credentials[f].trim()
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "missing_credentials" },
      { status: 400 }
    );
  }
  // Mock rejection trigger (documented in requirements.md §5): any credential
  // value of "bad" or "expired" simulates the provider rejecting the
  // credentials. The failure is persisted on the channel so the "error"
  // status is visible in the contacts list.
  const rejected = channel.credentialFields.some((f) => {
    const v = String(credentials[f]).trim().toLowerCase();
    return v === "bad" || v === "expired";
  });
  if (rejected) {
    channel.connected = false;
    channel.error = "invalid_credentials";
    return NextResponse.json(
      { error: "invalid_credentials" },
      { status: 400 }
    );
  }
  channel.connected = true;
  channel.error = null;
  return NextResponse.json({ id: channel.id, connected: true });
}
