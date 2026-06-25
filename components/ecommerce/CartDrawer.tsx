"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "./CartContext";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-charcoal/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-sm border-l border-gold/25 bg-warm-white transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gold/20 p-5">
            <p className="font-cinzel text-lg text-charcoal">Your Cart ({cart.count})</p>
            <button onClick={onClose} aria-label="Close cart" className="text-taupe hover:text-crimson">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {!cart.items.length && <p className="text-sm text-taupe">Your cart is empty.</p>}
            <div className="space-y-4">
              {cart.items.map((item) => {
                const key = cart.itemKey(item);
                return (
                  <div key={key} className="flex gap-3 border-b border-gold/10 pb-4">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden">
                      <Image src={item.product.image} alt="" fill sizes="64px" className="object-cover object-top" />
                    </div>
                    <div className="flex-1">
                      <p className="font-cinzel text-sm text-charcoal">{item.product.name}</p>
                      <p className="mt-1 text-xs text-taupe">{item.size} / {item.color} &middot; Qty {item.quantity}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-crimson">{formatPrice(item.product.price * item.quantity)}</p>
                        <button
                          type="button"
                          onClick={() => cart.removeItem(key)}
                          className="text-[10px] uppercase tracking-[0.25em] text-taupe hover:text-crimson"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {cart.items.length > 0 && (
            <div className="border-t border-gold/20 p-5">
              <div className="flex justify-between font-cinzel text-lg text-charcoal">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <Link href="/checkout" onClick={onClose} className="btn-gold mt-4 w-full justify-center">
                Checkout
              </Link>
              <Link href="/cart" onClick={onClose} className="btn-outline-gold mt-3 w-full justify-center">
                View Cart
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
