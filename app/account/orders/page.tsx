import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { verifyCustomerSession } from "@/lib/auth/customerDal";
import { listOrdersByUid } from "@/lib/data/orders";
import { formatPrice } from "@/lib/products";

export const metadata = { title: "My Orders | Trinetra By Rajababu" };

export default async function MyOrdersPage() {
  const session = await verifyCustomerSession();
  if (!session) redirect("/account/login");

  const orders = await listOrdersByUid(session.uid);

  return (
    <section className="min-h-screen linen-bg pt-24 sm:pt-32 pb-16">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <p className="eyebrow-stitch mb-5">My Account</p>
        <h1 className="heading-stitched text-3xl sm:text-4xl mb-8">Order History</h1>

        {orders.length === 0 && (
          <div className="border border-gold/20 bg-warm-white/90 p-8 text-center">
            <p className="text-taupe mb-6">You haven&rsquo;t placed any orders yet.</p>
            <Link href="/shop" className="btn-gold">Browse The Atelier</Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gold/20 bg-warm-white/90 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <p className="font-cinzel text-crimson">#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-taupe">
                  {order.status} &middot; {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex gap-3 text-sm">
                    <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden">
                      <Image src={item.image} alt="" fill sizes="44px" className="object-cover object-top" />
                    </div>
                    <div className="flex-1">
                      <p className="text-charcoal">{item.name}</p>
                      <p className="text-taupe text-xs">{item.size} / {item.color} &middot; Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider-dash my-4" />
              <div className="flex justify-between font-cinzel text-crimson">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
