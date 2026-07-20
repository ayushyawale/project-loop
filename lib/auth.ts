import { type NextRequest } from "next/server";
import { seedData } from "@/lib/seed-data";

export const SESSION_COOKIE = "loop-demo-session";

export function getSessionUserId(cookieHeader?: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=")[1] ?? "");
}

export function getSessionUser(request: NextRequest | Request) {
  const cookieHeader = request.headers.get("cookie") ?? undefined;
  const userId = getSessionUserId(cookieHeader);
  return seedData.users.find((user) => user.id === userId) ?? null;
}

export function buildSessionCookie(userId: string) {
  return `${SESSION_COOKIE}=${encodeURIComponent(userId)}; Path=/; HttpOnly; SameSite=Lax`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}
