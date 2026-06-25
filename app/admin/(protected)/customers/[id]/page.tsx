import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/data/customers";
import { getOrdersByIds } from "@/lib/data/orders";
import { formatPrice } from "@/lib/products";

export const metadata = { title: "Customer | Admin | Trinetra" };

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const orders = await getOrdersByIds(customer.orderIds);

  return (
    <div>
      <p className="eyebrow-stitch mb-4">Customer</p>
      <h1 className="heading-stitched text-3xl mb-2">{customer.name}</h1>
      <p className="text-taupe mb-8">{customer.email} &middot; {customer.phone}</p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          ["Orders", String(customer.orderCount)],
          ["Lifetime Value", formatPrice(customer.lifetimeValue)],
          ["Last Order", new Date(customer.lastOrderAt).toLocaleDateString()],
        ].map(([label, value]) => (
          <div key={label} className="border border-gold/25 bg-charcoal p-6 text-warm-white">
            <p className="text-sm text-warm-white/55">{label}</p>
            <p className="mt-3 font-cinzel text-xl text-gold">{value}</p>
          </div>
        ))}
      </div>

      <div className="border border-gold/20 bg-warm-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-left text-taupe uppercase text-[10px] tracking-[0.2em]">
              <th className="p-4">Order</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Total</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gold/10">
                <td className="p-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-crimson font-cinzel text-xs">
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="p-4 text-taupe">{order.status}</td>
                <td className="p-4 text-taupe">{order.paymentStatus}</td>
                <td className="p-4 text-charcoal">{formatPrice(order.total)}</td>
                <td className="p-4 text-taupe">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
