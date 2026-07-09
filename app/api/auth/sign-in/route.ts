import { NextResponse } from "next/server";
import { encodeToken, roleForEmail } from "@/lib/mock/token";
import { simulateLatency, stableUserId } from "@/lib/mock/util";

export async function POST(req: Request) {
  await simulateLatency("/api/auth/sign-in");
  const { email, password } = await req.json().catch(() => ({}));
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    return NextResponse.json(
      { error: "invalid_credentials" },
      { status: 401 }
    );
  }
  // Mock: any email signs in; the id is derived from the email so the same
  // account keeps the same id across sessions.
  const user = {
    id: stableUserId(email),
    email,
    role: roleForEmail(email),
  };
  return NextResponse.json({ user, token: encodeToken(user) });
}
