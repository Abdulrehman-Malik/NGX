"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [email,setEmail] = useState<string | null>(null);
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>{ if(!data.user) router.replace("/login"); else setEmail(data.user.email ?? null); }); },[router]);
  async function logout(){ await supabase.auth.signOut(); router.replace("/login"); }
  if(!email) return null;
  return <main className="page"><div className="card home"><h1>Welcome</h1><p>You are logged in as <strong>{email}</strong>.</p><button className="btn logout" onClick={logout}>Logout</button></div></main>;
}
