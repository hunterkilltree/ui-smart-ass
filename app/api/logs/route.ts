import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";
import { decodeToken } from "@/lib/mock/token";

export async function GET(req: Request) {
  const user = decodeToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "developer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const direction = url.searchParams.get("direction");
  const status = url.searchParams.get("status");
  const limit = Number(url.searchParams.get("limit") || 50);

  let logs = store().logs;
  if (direction === "in" || direction === "out") {
    logs = logs.filter((l) => l.direction === direction);
  }
  if (status) {
    logs = logs.filter((l) => String(l.status) === status);
  }
  return NextResponse.json(logs.slice(0, limit));
}
