import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/modules/auth/schemas";
import { login, AuthenticationError, AccountLockedError } from "@/modules/auth/auth-service";
import { setSessionCookie } from "@/lib/session-cookie";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await login(parsed.data.usernameOrEmail, parsed.data.password, {
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    setSessionCookie(result.sessionToken);

    return NextResponse.json({ user: result.user });
  } catch (error) {
    if (error instanceof AccountLockedError) {
      return NextResponse.json({ error: error.message }, { status: 423 });
    }
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    // Log technical detail server-side, return a generic message to the client.
    console.error("Login error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
