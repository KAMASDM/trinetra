"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/api/auth/customer-session", { method: "DELETE" });
      await signOut(auth);
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="text-[11px] uppercase tracking-[0.25em] text-taupe hover:text-crimson disabled:opacity-50"
    >
      {pending ? "Logging Out" : "Logout"}
    </button>
  );
}
