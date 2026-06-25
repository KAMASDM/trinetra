"use client";

import { useRouter } from "next/navigation";
import AccountAuthPanel from "@/components/account/AccountAuthPanel";

export default function AccountLoginPage() {
  const router = useRouter();

  return (
    <section className="min-h-screen linen-bg flex items-center justify-center px-6 py-28">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative w-full max-w-md">
        <p className="eyebrow-stitch mb-5 text-center">Account</p>
        <h1 className="font-cinzel text-3xl text-charcoal text-center mb-8">Sign In or Register</h1>
        <AccountAuthPanel
          onSignedIn={() => {
            router.push("/account/orders");
            router.refresh();
          }}
        />
      </div>
    </section>
  );
}
