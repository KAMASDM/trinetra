"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/ecommerce/CartContext";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/#collections" },
  { label: "Heritage", href: "/#heritage" },
  { label: "Bridal", href: "/#bridal" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-charcoal/90 border-b border-gold/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Trinetra Logo"
            width={40}
            height={40}
            className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0"
            style={{ objectFit: "contain" }}
          />

          <div className="hidden sm:block">
            <p
              className="text-gold font-cinzel text-sm font-semibold tracking-[0.2em] uppercase leading-none"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Trinetra
            </p>
            <p
              className="text-gold/60 text-[9px] tracking-[0.35em] uppercase leading-none mt-1"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              By Rajababu
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="relative text-warm-white/70 hover:text-gold transition-colors duration-300 text-[11px] tracking-[0.3em] uppercase group"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-400" />
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/account/orders" className="text-[11px] uppercase tracking-[0.3em] text-warm-white/70 hover:text-gold">
            Account
          </Link>
          <button onClick={cart.openDrawer} className="btn-outline-gold text-[11px] py-3 px-5">
            Cart ({cart.count})
          </button>
          <Link href="/admin" className="btn-gold text-[11px] py-3 px-6">
            Admin
          </Link>
        </div>

        {/* Mobile: cart + hamburger (Account/Cart core actions live in the bottom nav) */}
        <div className="flex items-center gap-3 lg:hidden">
          <button onClick={cart.openDrawer} className="relative p-2" aria-label="Open cart">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#C9922A" strokeWidth="1.5">
              <path d="M3 6h2l1.6 9.6a2 2 0 0 0 2 1.7h8.8a2 2 0 0 0 2-1.6L21 9H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" fill="#C9922A" stroke="none" />
              <circle cx="17" cy="20" r="1.4" fill="#C9922A" stroke="none" />
            </svg>
            {cart.count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[9px] text-warm-white">
                {cart.count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-2 group"
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-px w-6 bg-gold transition-all duration-300 ${
                  mobileOpen && i === 0
                    ? "rotate-45 translate-y-2"
                    : mobileOpen && i === 1
                    ? "opacity-0 scale-x-0"
                    : mobileOpen && i === 2
                    ? "-rotate-45 -translate-y-2"
                    : ""
                }`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-charcoal/95 backdrop-blur-md border-t border-gold/15 px-6 py-6">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-warm-white/70 hover:text-gold transition-colors text-[11px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn-gold inline-flex text-[11px] py-3 px-6 mt-2">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
