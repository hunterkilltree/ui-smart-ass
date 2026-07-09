import { NextResponse } from "next/server";
import { simulateLatency } from "@/lib/mock/util";

export async function POST(req: Request) {
  await simulateLatency("/api/auth/forgot-password");
  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }
  // Mock: no email is actually sent. `resetUrl` is the link the email would
  // contain — the UI can surface it as a dev hint. Any token other than
  // "expired" is accepted by POST /api/auth/reset-password.
  return NextResponse.json({
    ok: true,
    resetUrl: "/reset-password?token=mock-token",
  });
}
