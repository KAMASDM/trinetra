"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatPrice } from "@/lib/products";
import { useCart } from "./CartContext";

export default function CheckoutForm() {
  const cart = useCart();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.items.length) return;

    setStatus("saving");
    const form = new FormData(event.currentTarget);
    const payload = {
      customer: {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        city: form.get("city"),
        address: form.get("address"),
      },
      notes: form.get("notes"),
      status: "new",
      paymentStatus: "pending",
      subtotal: cart.subtotal,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.product.image,
      })),
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "orders"), payload);
      cart.clearCart();
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="min-h-screen linen-bg pt-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="eyebrow-stitch mb-5">Order Received</p>
          <h1 className="heading-stitched text-4xl">We Will Confirm Shortly</h1>
          <p className="my-8 text-taupe">Your order has been saved in Firebase Firestore under the `orders` collection.</p>
          <Link href="/shop" className="btn-gold">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen linen-bg pt-28 pb-16">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-6xl mx-auto px-6">
        <p className="eyebrow-stitch mb-5">Checkout</p>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="border border-gold/20 bg-warm-white/80 p-6">
            <h1 className="font-cinzel text-3xl text-charcoal">Delivery & Consultation Details</h1>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["name", "Full name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["city", "City"],
              ].map(([name, label]) => (
                <label key={name} className="block">
                  <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">{label}</span>
                  <input required name={name} className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Address</span>
              <textarea required name="address" rows={3} className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
            </label>
            <label className="mt-4 block">
              <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Measurements, custom notes or occasion date</span>
              <textarea name="notes" rows={4} className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
            </label>
            <button disabled={!cart.items.length || status === "saving"} type="submit" className="btn-gold mt-6">
              {status === "saving" ? "Saving Order" : "Place Order Request"}
            </button>
            {status === "error" && <p className="mt-4 text-sm text-crimson">Firebase rejected the write. Check Firestore rules/auth and try again.</p>}
          </form>

          <aside className="h-fit border border-gold/25 bg-charcoal p-6 text-warm-white">
            <p className="font-cinzel text-2xl text-gold">Summary</p>
            <div className="divider-dash my-5" />
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3 text-sm">
                  <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="text-warm-white/80">{item.product.name}</p>
                    <p className="text-warm-white/40">{item.quantity} x {formatPrice(item.product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="divider-dash my-5" />
            <div className="flex justify-between font-cinzel text-xl text-gold">
              <span>Total</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
