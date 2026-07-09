// Shared helpers for the mock route handlers. Server-side only.
import { NextResponse } from "next/server";
import { decodeToken } from "./token";
import type { User } from "../types";

/** Deterministic 32-bit FNV-1a hash — stable ids and reproducible mock behavior. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Same email always yields the same mock user id (stable across sign-ins). */
export function stableUserId(email: string): string {
  return `u_${hashString(email.trim().toLowerCase()).toString(36)}`;
}

/**
 * Deterministic 150–400 ms artificial latency so loading states are actually
 * exercised during FE development. Awaited inside the request lifetime, so it
 * is serverless-safe (unlike fire-and-forget timers).
 */
export function simulateLatency(key: string): Promise<void> {
  const ms = 150 + (hashString(key) % 251);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Decode the Bearer token from the request, or null if missing/invalid. */
export function requireUser(req: Request): User | null {
  return decodeToken(req.headers.get("authorization"));
}

/** Standard 401 body shared by all guarded mock endpoints. */
export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
