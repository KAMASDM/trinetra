import Link from "next/link";
import { listOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/products";
import ExportOrdersCsvButton from "@/components/admin/ExportOrdersCsvButton";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export const metadata = { title: "Orders | Admin | Trinetra" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; paymentStatus?: string }>;
}) {
  const { status, paymentStatus } = await searchParams;
  const orders = await listOrders({
    status: (status as OrderStatus) || undefined,
    paymentStatus: (paymentStatus as PaymentStatus) || undefined,
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow-stitch mb-4">Fulfilment</p>
          <h1 className="heading-stitched text-4xl">Orders</h1>
        </div>
        <ExportOrdersCsvButton orders={orders} />
      </div>

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <select name="status" defaultValue={status ?? ""} className="admin-input max-w-[180px]">
          <option value="">All statuses</option>
          {["new", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <select name="paymentStatus" defaultValue={paymentStatus ?? ""} className="admin-input max-w-[180px]">
          <option value="">All payments</option>
          {["created", "pending", "paid", "failed", "refunded"].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <button type="submit" className="btn-outline-gold !py-3 !px-5 text-xs">Filter</button>
      </form>

      <div className="border border-gold/20 bg-warm-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-left text-taupe uppercase text-[10px] tracking-[0.2em]">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
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
                <td className="p-4 text-charcoal">{order.customer.name}</td>
                <td className="p-4 text-taupe">{order.status}</td>
                <td className="p-4 text-taupe">{order.paymentStatus}</td>
                <td className="p-4 text-charcoal">{formatPrice(order.total)}</td>
                <td className="p-4 text-taupe">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-taupe">No orders match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
