import { NextResponse } from "next/server";
import { encodeToken, roleForEmail } from "@/lib/mock/token";
import { simulateLatency, stableUserId } from "@/lib/mock/util";

export async function POST(req: Request) {
  await simulateLatency("/api/auth/sign-up");
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }
  const user = {
    id: stableUserId(email),
    email,
    role: roleForEmail(email),
  };
  return NextResponse.json({ user, token: encodeToken(user) });
}
