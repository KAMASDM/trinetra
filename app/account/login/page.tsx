"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AccountAuthPanel from "@/components/account/AccountAuthPanel";

export default function AccountLoginPage() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen linen-bg flex items-center justify-center px-4 sm:px-6 py-20 sm:py-28">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative w-full max-w-md">
        <AccountAuthPanel
          header={
            <div className="text-center">
              <Image
                src="/logo.png"
                alt="Trinetra Logo"
                width={52}
                height={52}
                className="mx-auto h-12 w-12"
                style={{ objectFit: "contain" }}
              />
              <p className="mt-3 text-crimson font-cinzel text-base font-semibold tracking-[0.2em] uppercase leading-none">
                Trinetra
              </p>
              <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
              <h1 className="mt-4 font-cinzel text-2xl text-charcoal">Sign In or Register</h1>
              <p className="mt-2 text-sm text-taupe">Access your order history and a faster checkout.</p>
            </div>
          }
          onSignedIn={() => {
            router.push("/account/orders");
            router.refresh();
          }}
        />
      </div>
    </section>
  );
}
