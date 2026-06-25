import Link from "next/link";
import { listAllProducts } from "@/lib/data/products";
import { listOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/products";

export const metadata = { title: "Dashboard | Admin | Trinetra" };

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([listAllProducts(), listOrders()]);

  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  const revenue = paidOrders.reduce((total, order) => total + order.total, 0);
  const newOrders = orders.filter((order) => order.status === "new" || order.status === "confirmed").length;
  const lowStock = products.filter((product) => product.inventory <= 5 && product.status !== "archived");

  const salesByProduct = new Map<string, number>();
  for (const order of paidOrders) {
    for (const item of order.items) {
      salesByProduct.set(item.productId, (salesByProduct.get(item.productId) ?? 0) + item.quantity);
    }
  }
  const bestsellers = [...salesByProduct.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId, quantity]) => ({
      product: products.find((product) => product.id === productId),
      quantity,
    }))
    .filter((entry) => entry.product);

  const stats = [
    ["Revenue (Paid)", formatPrice(revenue)],
    ["New / Confirmed Orders", String(newOrders)],
    ["Total Orders", String(orders.length)],
    ["Low Stock SKUs", String(lowStock.length)],
  ] as const;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow-stitch mb-4">Overview</p>
          <h1 className="heading-stitched text-4xl">Commerce Desk</h1>
        </div>
        <Link href="/admin/products/new" className="btn-gold">Add Product</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="border border-gold/25 bg-charcoal p-6 text-warm-white">
            <p className="text-sm text-warm-white/55">{label}</p>
            <p className="mt-3 font-cinzel text-2xl text-gold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-gold/20 bg-warm-white p-6">
          <p className="font-cinzel text-xl text-crimson">Low Stock</p>
          <ul className="mt-4 space-y-3">
            {lowStock.length === 0 && <li className="text-sm text-taupe">All SKUs healthy.</li>}
            {lowStock.map((product) => (
              <li key={product.id} className="border-l-2 border-gold pl-3 text-sm leading-relaxed text-taupe flex justify-between">
                <Link href={`/admin/products/${product.id}/edit`} className="hover:text-crimson">{product.name}</Link>
                <span>{product.inventory} left</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-gold/20 bg-warm-white p-6">
          <p className="font-cinzel text-xl text-crimson">Bestsellers</p>
          <ul className="mt-4 space-y-3">
            {bestsellers.length === 0 && <li className="text-sm text-taupe">No paid orders yet.</li>}
            {bestsellers.map((entry) => (
              <li key={entry.product!.id} className="border-l-2 border-gold pl-3 text-sm leading-relaxed text-taupe flex justify-between">
                <span>{entry.product!.name}</span>
                <span>{entry.quantity} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
