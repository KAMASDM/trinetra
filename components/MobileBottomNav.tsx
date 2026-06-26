"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/ecommerce/CartContext";

function ShopIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={active ? "#E6B400" : "rgba(255,253,248,0.6)"} strokeWidth="1.5">
      <path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={active ? "#E6B400" : "rgba(255,253,248,0.6)"} strokeWidth="1.5">
      <path d="M3 6h2l1.6 9.6a2 2 0 0 0 2 1.7h8.8a2 2 0 0 0 2-1.6L21 9H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" fill={active ? "#E6B400" : "rgba(255,253,248,0.6)"} stroke="none" />
      <circle cx="17" cy="20" r="1.4" fill={active ? "#E6B400" : "rgba(255,253,248,0.6)"} stroke="none" />
    </svg>
  );
}

function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={active ? "#E6B400" : "rgba(255,253,248,0.6)"} strokeWidth="1.5">
      <circle cx="12" cy="8" r="3.2" strokeLinecap="round" />
      <path d="M5 20c0-3.5 3.2-6 7-6s7 2.5 7 6" strokeLinecap="round" />
    </svg>
  );
}

function TrackIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={active ? "#E6B400" : "rgba(255,253,248,0.6)"} strokeWidth="1.5">
      <path d="M3 12h4l2-7 4 14 2-7h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cart = useCart();

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="relative border-t border-gold/20 bg-charcoal/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 items-stretch">
          <Link href="/shop" className="flex flex-col items-center justify-center gap-1 py-2.5">
            <ShopIcon active={isActive("/shop")} />
            <span
              className={`text-[9px] uppercase tracking-[0.15em] ${isActive("/shop") ? "text-gold" : "text-warm-white/60"}`}
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Shop
            </span>
          </Link>

          <button onClick={cart.openDrawer} className="relative flex flex-col items-center justify-center gap-1 py-2.5">
            <span className="relative">
              <CartIcon active={cart.isDrawerOpen} />
              {cart.count > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[9px] text-warm-white">
                  {cart.count}
                </span>
              )}
            </span>
            <span
              className={`text-[9px] uppercase tracking-[0.15em] ${cart.isDrawerOpen ? "text-gold" : "text-warm-white/60"}`}
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Cart
            </span>
          </button>

          {/* Reserved space for the centered logo button below */}
          <div aria-hidden />

          <Link href="/account/orders" className="flex flex-col items-center justify-center gap-1 py-2.5">
            <AccountIcon active={isActive("/account")} />
            <span
              className={`text-[9px] uppercase tracking-[0.15em] ${isActive("/account") ? "text-gold" : "text-warm-white/60"}`}
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Account
            </span>
          </Link>

          <Link href="/track-order" className="flex flex-col items-center justify-center gap-1 py-2.5">
            <TrackIcon active={isActive("/track-order")} />
            <span
              className={`text-[9px] uppercase tracking-[0.15em] ${isActive("/track-order") ? "text-gold" : "text-warm-white/60"}`}
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Track
            </span>
          </Link>
        </div>

        {/* Brand mark, raised half on / half above the bar, doubles as the Home shortcut */}
        <Link
          href="/"
          aria-label="Home"
          className="absolute left-1/2 -top-6 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-charcoal shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
        >
          <Image src="/logo.png" alt="Trinetra" width={34} height={34} className="h-[34px] w-[34px] object-contain" />
        </Link>
      </div>
    </nav>
  );
}
