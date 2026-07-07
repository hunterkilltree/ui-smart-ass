import { NextResponse } from "next/server";
import { encodeToken, roleForEmail } from "@/lib/mock/token";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }
  const user = {
    id: `u_${Math.random().toString(36).slice(2, 10)}`,
    email,
    role: roleForEmail(email),
  };
  return NextResponse.json({ user, token: encodeToken(user) });
}
