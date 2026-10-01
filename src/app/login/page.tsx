"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent){ e.preventDefault(); setError(""); setLoading(true); const {error}=await supabase.auth.signInWithPassword({email,password}); if(error)setError(error.message); else router.replace("/"); setLoading(false); }
  return <main className="page"><form className="card" onSubmit={submit}><h1>Login</h1><label>Email</label><input className="field" type="email" required value={email} onChange={e=>setEmail(e.target.value)} /><label>Password</label><input className="field" type="password" required value={password} onChange={e=>setPassword(e.target.value)} />{error&&<div className="error">{error}</div>}<button className="btn" disabled={loading}>{loading?"Signing in...":"Sign in"}</button></form></main>;
}
