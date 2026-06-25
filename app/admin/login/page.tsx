"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Invalid email/password, or this account is not an admin.");
    }
  }

  return (
    <section className="min-h-screen linen-bg flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative w-full max-w-md border border-gold/20 bg-warm-white/90 p-8">
        <p className="eyebrow-stitch mb-5">Admin</p>
        <h1 className="font-cinzel text-3xl text-charcoal">Commerce Desk Login</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Email</span>
            <input
              required
              type="email"
              name="email"
              autoComplete="username"
              className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Password</span>
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
            />
          </label>
          <button disabled={status === "loading"} type="submit" className="btn-gold w-full mt-2">
            {status === "loading" ? "Signing In" : "Sign In"}
          </button>
          {status === "error" && <p className="text-sm text-crimson">{message}</p>}
        </form>
      </div>
    </section>
  );
}
