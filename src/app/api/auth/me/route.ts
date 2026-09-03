import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/db";

export async function GET() {
  const authorizedUser = await getCurrentUser();

  if (!authorizedUser) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: authorizedUser.userId },
    select: { id: true, username: true, email: true, fullName: true },
  });

  return NextResponse.json({ user });
}
