"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-slate-800">
          Sign in to NGX
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Username or email" htmlFor="usernameOrEmail">
            <Input
              id="usernameOrEmail"
              name="usernameOrEmail"
              autoComplete="username"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormField>

          {error ? (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button type="submit" isLoading={isLoading} className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
