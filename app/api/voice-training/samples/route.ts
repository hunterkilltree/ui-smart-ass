import { NextResponse } from "next/server";
import { PROMPTS, resolveSampleStatus, store } from "@/lib/mock/store";
import { requireUser, simulateLatency, unauthorized } from "@/lib/mock/util";
import type { VoiceSample } from "@/lib/types";

export async function GET(req: Request) {
  await simulateLatency("/api/voice-training/samples");
  if (!requireUser(req)) return unauthorized();
  // Statuses are resolved lazily on read (serverless-safe — no timers).
  const samples = store()
    .samples.map(resolveSampleStatus)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(samples);
}

export async function POST(req: Request) {
  await simulateLatency("/api/voice-training/samples#post");
  if (!requireUser(req)) return unauthorized();
  const form = await req.formData().catch(() => null);
  const promptId = form?.get("promptId");
  const audio = form?.get("audio");
  const langRaw = form?.get("lang");
  if (typeof promptId !== "string" || !(audio instanceof Blob)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!PROMPTS.some((p) => p.id === promptId)) {
    return NextResponse.json({ error: "unknown_prompt" }, { status: 400 });
  }
  let lang: "vi" | "en" | undefined;
  if (langRaw != null) {
    if (langRaw !== "vi" && langRaw !== "en") {
      return NextResponse.json({ error: "invalid_lang" }, { status: 400 });
    }
    lang = langRaw;
  }
  const sample: VoiceSample = {
    id: `s_${Math.random().toString(36).slice(2, 10)}`,
    promptId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  if (lang) sample.lang = lang;
  store().samples.push(sample);
  // No setTimeout here: the pending → processed/failed transition is computed
  // lazily from createdAt in resolveSampleStatus (see lib/mock/store.ts), so
  // it survives serverless environments where handlers die after responding.
  return NextResponse.json(sample);
}
