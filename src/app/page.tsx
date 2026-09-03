import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/logout-button";

export default async function Home() {
  const authorizedUser = await getCurrentUser();
  const user = authorizedUser
    ? await prisma.user.findUnique({
        where: { id: authorizedUser.userId },
        select: { fullName: true, username: true },
      })
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">NGX POS &amp; ERP</h1>

      {user ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-slate-600">
            Signed in as <span className="font-medium">{user.fullName}</span> ({user.username})
          </p>
          <LogoutButton />
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Sign in
        </Link>
      )}

      <p className="max-w-md text-sm text-slate-500">
        Phase 1 (Authentication) in progress. See{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5">docs/PROJECT_STATE.md</code>{" "}
        for current status.
      </p>
    </main>
  );
}
