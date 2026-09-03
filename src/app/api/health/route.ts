import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Basic health-check endpoint.
 * Verifies the process is up and, if a database is configured,
 * that a connection can be established.
 */
export async function GET() {
  const status: { app: "ok"; db: "ok" | "unavailable" | "not_checked" } = {
    app: "ok",
    db: "not_checked",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    status.db = "ok";
  } catch {
    status.db = "unavailable";
  }

  return NextResponse.json(status);
}
