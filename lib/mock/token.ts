// Stateless mock token: base64(JSON). NOT secure — mock only.
import type { User } from "../types";

export function encodeToken(user: User): string {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

export function decodeToken(header: string | null): User | null {
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const user = JSON.parse(
      Buffer.from(header.slice(7), "base64url").toString("utf8")
    ) as User;
    if (!user?.id || !user?.email) return null;
    return user;
  } catch {
    return null;
  }
}

export function roleForEmail(email: string): "user" | "developer" {
  return email.toLowerCase().includes("dev") ? "developer" : "user";
}
