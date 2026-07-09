import { NextResponse } from "next/server";
import { simulateLatency } from "@/lib/mock/util";

export async function POST(req: Request) {
  await simulateLatency("/api/auth/reset-password");
  const { token, password } = await req.json().catch(() => ({}));
  if (typeof token !== "string" || !token.trim()) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }
  // Mock rule: the literal token "expired" simulates an expired reset link;
  // any other non-empty token is accepted.
  if (token === "expired") {
    return NextResponse.json({ error: "expired_token" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
