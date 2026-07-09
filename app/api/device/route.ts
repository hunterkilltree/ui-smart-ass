import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";
import { requireUser, simulateLatency, unauthorized } from "@/lib/mock/util";

export async function GET(req: Request) {
  await simulateLatency("/api/device");
  if (!requireUser(req)) return unauthorized();
  return NextResponse.json(store().device);
}
