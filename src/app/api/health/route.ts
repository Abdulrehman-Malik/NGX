import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "Supabase environment variables are missing" }, { status: 500 });
  try {
    const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key }, cache: "no-store" });
    return NextResponse.json({ ok: response.ok, supabase: response.ok ? "reachable" : "request failed", status: response.status }, { status: response.ok ? 200 : 502 });
  } catch { return NextResponse.json({ ok: false, error: "Unable to reach Supabase" }, { status: 502 }); }
}
