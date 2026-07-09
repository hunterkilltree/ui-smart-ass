import { NextResponse } from "next/server";
import { requireUser, simulateLatency, unauthorized } from "@/lib/mock/util";

export async function GET(req: Request) {
  await simulateLatency("/api/auth/me");
  const user = requireUser(req);
  if (!user) return unauthorized();
  return NextResponse.json(user);
}
