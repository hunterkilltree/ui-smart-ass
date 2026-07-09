import { NextResponse } from "next/server";
import { PROMPTS } from "@/lib/mock/store";
import { requireUser, simulateLatency, unauthorized } from "@/lib/mock/util";

export async function GET(req: Request) {
  await simulateLatency("/api/voice-training/prompts");
  if (!requireUser(req)) return unauthorized();
  return NextResponse.json(PROMPTS);
}
