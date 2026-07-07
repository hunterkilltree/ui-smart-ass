import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";
import type { VoiceSample } from "@/lib/types";

export async function GET() {
  const samples = [...store().samples].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  return NextResponse.json(samples);
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const promptId = form?.get("promptId");
  const audio = form?.get("audio");
  if (typeof promptId !== "string" || !(audio instanceof Blob)) {
    return NextResponse.json(
      { error: "promptId and audio are required" },
      { status: 400 }
    );
  }
  const sample: VoiceSample = {
    id: `s_${Math.random().toString(36).slice(2, 10)}`,
    promptId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store().samples.push(sample);
  // Mock: mark processed after 8s
  setTimeout(() => {
    sample.status = Math.random() < 0.9 ? "processed" : "failed";
  }, 8000);
  return NextResponse.json(sample);
}
