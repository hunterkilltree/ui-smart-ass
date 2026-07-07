import { NextResponse } from "next/server";
import { decodeToken } from "@/lib/mock/token";

export async function GET(req: Request) {
  const user = decodeToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(user);
}
