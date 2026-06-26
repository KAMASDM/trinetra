"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/products";

const STATUS_LABEL: Record<Order["status"], string> = {
  new: "Order Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

function TrackOrderForm() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setOrder(null);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: form.get("orderId"),
          contact: form.get("contact"),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Order not found");
      setOrder(body.order);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Order not found");
    }
  }

  return (
    <section className="min-h-screen linen-bg pt-24 sm:pt-32 pb-16">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <p className="eyebrow-stitch mb-5" style={{ color: "var(--crimson)" }}>Track Order</p>
        <h1 className="heading-stitched text-3xl sm:text-4xl mb-8" style={{ color: "var(--crimson)" }}>Where Is My Order</h1>

        <form onSubmit={handleSubmit} className="border border-gold/20 bg-warm-white/90 p-6 space-y-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Order ID</span>
            <input
              required
              name="orderId"
              defaultValue={searchParams.get("orderId") ?? ""}
              className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Email or Phone used at checkout</span>
            <input
              required
              name="contact"
              className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
            />
          </label>
          <button disabled={status === "loading"} type="submit" className="btn-gold">
            {status === "loading" ? "Searching" : "Track Order"}
          </button>
          {status === "error" && <p className="text-sm text-crimson">{message}</p>}
        </form>

        {order && (
          <div className="mt-8 border border-gold/25 bg-charcoal p-6 text-warm-white">
            <p className="font-cinzel text-2xl text-gold">{STATUS_LABEL[order.status]}</p>
            <div className="divider-dash my-5" />
            <ul className="space-y-3">
              {order.timeline.map((entry, index) => (
                <li key={index} className="text-sm text-warm-white/70 flex justify-between">
                  <span>{entry.status.replace(/_/g, " ")}</span>
                  <span className="text-warm-white/40">{new Date(entry.at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
            {order.trackingNumber && (
              <p className="mt-4 text-sm text-warm-white/70">
                Tracking: {order.trackingNumber} {order.courier ? `via ${order.courier}` : ""}
              </p>
            )}
            <div className="divider-dash my-5" />
            <div className="flex justify-between font-cinzel text-xl text-gold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderForm />
    </Suspense>
  );
}
