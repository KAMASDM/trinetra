"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountAuthPanel from "@/components/account/AccountAuthPanel";

export default function AccountLoginPage() {
  const router = useRouter();

  return (
    <section className="min-h-screen linen-bg flex items-center justify-center px-6 py-28">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="flex flex-col items-center gap-3 mb-8">
          <Image
            src="/logo.png"
            alt="Trinetra Logo"
            width={56}
            height={56}
            className="w-14 h-14"
            style={{ objectFit: "contain" }}
          />
          <div className="text-center">
            <p className="text-crimson font-cinzel text-lg font-semibold tracking-[0.2em] uppercase leading-none">
              Trinetra
            </p>
            <p
              className="text-taupe text-[9px] tracking-[0.35em] uppercase leading-none mt-1"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              By Rajababu
            </p>
          </div>
        </Link>
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
