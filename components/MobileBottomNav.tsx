"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/ecommerce/CartContext";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={active ? "#E6B400" : "rgba(255,253,248,0.6)"} strokeWidth="1.5">
      <path d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1H10v-5.5h4V20h3.5a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cart = useCart();

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const tabs = [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Shop", href: "/shop", icon: ShopIcon },
    { label: "Account", href: "/account/orders", icon: AccountIcon },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gold/20 bg-charcoal/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {tabs.slice(0, 2).map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-1 py-2.5"
            >
              <tab.icon active={active} />
              <span
                className={`text-[9px] uppercase tracking-[0.15em] ${active ? "text-gold" : "text-warm-white/60"}`}
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={cart.openDrawer}
          className="relative flex flex-col items-center justify-center gap-1 py-2.5"
        >
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

        {tabs.slice(2).map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-1 py-2.5"
            >
              <tab.icon active={active} />
              <span
                className={`text-[9px] uppercase tracking-[0.15em] ${active ? "text-gold" : "text-warm-white/60"}`}
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
