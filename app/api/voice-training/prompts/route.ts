import { NextResponse } from "next/server";
import { PROMPTS } from "@/lib/mock/store";

export async function GET() {
  return NextResponse.json(PROMPTS);
}
