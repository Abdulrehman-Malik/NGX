import { NextResponse } from "next/server";
import { logout } from "@/modules/auth/auth-service";
import { getSessionCookie, clearSessionCookie } from "@/lib/session-cookie";

export async function POST() {
  const token = getSessionCookie();

  if (token) {
    await logout(token);
  }

  clearSessionCookie();

  return NextResponse.json({ ok: true });
}
