import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  // Mock: always succeed
  return NextResponse.json({ ok: true });
}
