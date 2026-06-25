import Link from "next/link";
import { listCustomers } from "@/lib/data/customers";
import { formatPrice } from "@/lib/products";

export const metadata = { title: "Customers | Admin | Trinetra" };

export default async function AdminCustomersPage() {
  const customers = await listCustomers();

  return (
    <div>
      <p className="eyebrow-stitch mb-4">Relationships</p>
      <h1 className="heading-stitched text-4xl mb-8">Customers</h1>

      <div className="border border-gold/20 bg-warm-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-left text-taupe uppercase text-[10px] tracking-[0.2em]">
              <th className="p-4">Name</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Lifetime Value</th>
              <th className="p-4">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gold/10">
                <td className="p-4">
                  <Link href={`/admin/customers/${customer.id}`} className="text-crimson">{customer.name}</Link>
                </td>
                <td className="p-4 text-taupe">{customer.email}<br />{customer.phone}</td>
                <td className="p-4 text-charcoal">{customer.orderCount}</td>
                <td className="p-4 text-charcoal">{formatPrice(customer.lifetimeValue)}</td>
                <td className="p-4 text-taupe">{new Date(customer.lastOrderAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-taupe">No customers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
