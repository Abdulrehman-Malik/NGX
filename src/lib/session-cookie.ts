import { cookies } from "next/headers";
import { SESSION_DURATION_MS } from "@/modules/auth/session-token";

export const SESSION_COOKIE_NAME = "ngx_session";

export function setSessionCookie(token: string): void {
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export function clearSessionCookie(): void {
  cookies().delete(SESSION_COOKIE_NAME);
}

export function getSessionCookie(): string | undefined {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}
