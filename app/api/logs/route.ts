import { NextResponse } from "next/server";
import { store } from "@/lib/mock/store";
import { requireUser, simulateLatency, unauthorized } from "@/lib/mock/util";

export async function GET(req: Request) {
  await simulateLatency("/api/logs");
  const user = requireUser(req);
  if (!user) return unauthorized();
  if (user.role !== "developer") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const direction = url.searchParams.get("direction");
  const status = url.searchParams.get("status");

  const limitParam = url.searchParams.get("limit");
  let limit = 50;
  if (limitParam !== null) {
    const parsed = Number(limitParam);
    if (!/^\d+$/.test(limitParam) || !Number.isInteger(parsed) || parsed < 1) {
      return NextResponse.json({ error: "invalid_limit" }, { status: 400 });
    }
    limit = parsed;
  }

  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const fromTs = from ? Date.parse(from) : null;
  const toTs = to ? Date.parse(to) : null;
  if (
    (fromTs !== null && Number.isNaN(fromTs)) ||
    (toTs !== null && Number.isNaN(toTs))
  ) {
    return NextResponse.json({ error: "invalid_time_range" }, { status: 400 });
  }

  let logs = store().logs;
  if (direction === "in" || direction === "out") {
    logs = logs.filter((l) => l.direction === direction);
  }
  if (status) {
    logs = logs.filter((l) => String(l.status) === status);
  }
  if (fromTs !== null) {
    logs = logs.filter((l) => Date.parse(l.timestamp) >= fromTs);
  }
  if (toTs !== null) {
    logs = logs.filter((l) => Date.parse(l.timestamp) <= toTs);
  }
  return NextResponse.json(logs.slice(0, limit));
}
