import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
import { formatPrice } from "@/lib/products";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order || order.paymentStatus !== "paid") {
    notFound();
  }

  return (
    <section className="min-h-screen linen-bg pt-24 sm:pt-32 pb-16">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="eyebrow-stitch mb-5" style={{ color: "var(--crimson)" }}>Order Confirmed</p>
        <h1 className="heading-stitched text-3xl sm:text-4xl" style={{ color: "var(--crimson)" }}>Thank You, {order.customer.name.split(" ")[0]}</h1>
        <p className="my-6 text-taupe">
          Order <span className="text-crimson font-cinzel">#{order.id.slice(-8).toUpperCase()}</span> has been
          received and payment confirmed. We will reach out for measurement or styling consultation if needed.
        </p>

        <div className="border border-gold/25 bg-warm-white/90 p-6 text-left">
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex gap-3 text-sm">
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover object-top" />
                </div>
                <div className="flex-1">
                  <p className="text-charcoal">{item.name}</p>
                  <p className="text-taupe text-xs">
                    {item.size} / {item.color} &middot; Qty {item.quantity}
                  </p>
                </div>
                <p className="text-charcoal">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="divider-dash my-5" />
          <div className="flex justify-between font-cinzel text-xl text-crimson">
            <span>Total Paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/shop" className="btn-gold">Continue Shopping</Link>
          <Link href={`/track-order?orderId=${order.id}`} className="btn-outline-gold">Track This Order</Link>
        </div>
      </div>
    </section>
  );
}
