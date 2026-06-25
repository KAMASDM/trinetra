import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
import { formatPrice } from "@/lib/products";
import { updateOrderStatusAction } from "@/app/admin/actions";
import OrderStatusForm from "@/components/admin/OrderStatusForm";
import type { OrderStatus } from "@/lib/types";

export const metadata = { title: "Order | Admin | Trinetra" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  async function updateStatus(status: OrderStatus, note: string, trackingNumber: string, courier: string) {
    "use server";
    await updateOrderStatusAction(id, status, note || undefined, trackingNumber || undefined, courier || undefined);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <p className="eyebrow-stitch mb-4">Order #{order.id.slice(-8).toUpperCase()}</p>
        <h1 className="heading-stitched text-3xl mb-6">{order.customer.name}</h1>

        <div className="border border-gold/20 bg-warm-white p-6 mb-6">
          <p className="font-cinzel text-lg text-charcoal mb-4">Items</p>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex gap-3 text-sm">
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover object-top" />
                </div>
                <div className="flex-1">
                  <p className="text-charcoal">{item.name}</p>
                  <p className="text-taupe text-xs">{item.size} / {item.color} &middot; Qty {item.quantity}</p>
                </div>
                <p className="text-charcoal">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="divider-dash my-4" />
          <div className="flex justify-between font-cinzel text-lg text-crimson">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="border border-gold/20 bg-warm-white p-6 mb-6">
          <p className="font-cinzel text-lg text-charcoal mb-4">Customer & Delivery</p>
          <p className="text-sm text-taupe">{order.customer.email} &middot; {order.customer.phone}</p>
          <p className="text-sm text-taupe mt-1">{order.customer.address}, {order.customer.city}</p>
          {order.notes && <p className="text-sm text-taupe mt-3">Notes: {order.notes}</p>}
        </div>

        <div className="border border-gold/20 bg-warm-white p-6">
          <p className="font-cinzel text-lg text-charcoal mb-4">Update Status</p>
          <OrderStatusForm order={order} action={updateStatus} />
        </div>
      </div>

      <aside className="h-fit border border-gold/25 bg-charcoal p-6 text-warm-white">
        <p className="font-cinzel text-xl text-gold">Payment</p>
        <div className="divider-dash my-4" />
        <p className="text-sm text-warm-white/70">Status: {order.paymentStatus}</p>
        {order.razorpay?.paymentId && (
          <p className="text-sm text-warm-white/50 mt-2 break-all">Payment ID: {order.razorpay.paymentId}</p>
        )}
        <div className="divider-dash my-4" />
        <p className="font-cinzel text-xl text-gold">Timeline</p>
        <ul className="mt-3 space-y-2">
          {order.timeline.map((entry, index) => (
            <li key={index} className="text-sm text-warm-white/60 flex justify-between gap-2">
              <span>{entry.status.replace(/_/g, " ")}</span>
              <span className="text-warm-white/35 whitespace-nowrap">{new Date(entry.at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
