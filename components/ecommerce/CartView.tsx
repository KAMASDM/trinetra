"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "./CartContext";

export default function CartView() {
  const cart = useCart();

  if (!cart.items.length) {
    return (
      <section className="min-h-screen linen-bg pt-24 sm:pt-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="eyebrow-stitch mb-5" style={{ color: "var(--crimson)" }}>Your Cart</p>
          <h1 className="heading-stitched text-3xl sm:text-4xl" style={{ color: "var(--crimson)" }}>Cart Is Empty</h1>
          <p className="my-8 text-taupe">Begin with the atelier catalog and add pieces for checkout or consultation.</p>
          <Link href="/shop" className="btn-gold">Shop Collections</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen linen-bg pt-28 pb-16">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <p className="eyebrow-stitch mb-5">Your Cart</p>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.items.map((item) => {
              const key = cart.itemKey(item);
              return (
                <article key={key} className="grid gap-4 border border-gold/20 bg-warm-white/80 p-4 sm:grid-cols-[140px_1fr]">
                  <div className="relative h-44 overflow-hidden sm:h-full">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 140px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{item.product.category}</p>
                    <h2 className="mt-2 font-cinzel text-xl text-charcoal">{item.product.name}</h2>
                    <p className="mt-2 text-sm text-taupe">Size: {item.size} · Colour: {item.color}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button type="button" className="h-9 w-9 border border-gold/30" onClick={() => cart.updateQuantity(key, item.quantity - 1)}>-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button type="button" className="h-9 w-9 border border-gold/30" onClick={() => cart.updateQuantity(key, item.quantity + 1)}>+</button>
                      <button type="button" className="ml-auto text-[10px] uppercase tracking-[0.3em] text-crimson" onClick={() => cart.removeItem(key)}>
                        Remove
                      </button>
                    </div>
                    <p className="mt-5 font-cinzel text-crimson">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit border border-gold/25 bg-charcoal p-6 text-warm-white">
            <p className="font-cinzel text-2xl text-gold">Order Summary</p>
            <div className="divider-dash my-5" />
            <div className="flex justify-between text-sm text-warm-white/60">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm text-warm-white/60">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="mt-5 flex justify-between font-cinzel text-xl text-gold">
              <span>Total</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <Link href="/checkout" className="btn-gold mt-7 w-full justify-center">
              Checkout
            </Link>
            <Link href="/shop" className="btn-outline-gold mt-3 w-full justify-center">
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
