import Link from "next/link";
import { Plus } from "lucide-react";
import { listAllProducts } from "@/lib/data/products";
import { listOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Button nativeButton={false} render={<Link href="/admin/products/new" />}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label} className="border-gold/25 bg-charcoal text-warm-white">
            <CardContent className="pt-6">
              <p className="text-sm text-warm-white/55">{label}</p>
              <p className="mt-3 font-cinzel text-2xl text-gold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-cinzel text-xl text-crimson">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {lowStock.length === 0 && <li className="text-sm text-taupe">All SKUs healthy.</li>}
              {lowStock.map((product) => (
                <li
                  key={product.id}
                  className="flex justify-between border-l-2 border-gold pl-3 text-sm leading-relaxed text-taupe"
                >
                  <Link href={`/admin/products/${product.id}/edit`} className="hover:text-crimson">
                    {product.name}
                  </Link>
                  <span>{product.inventory} left</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-cinzel text-xl text-crimson">Bestsellers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {bestsellers.length === 0 && <li className="text-sm text-taupe">No paid orders yet.</li>}
              {bestsellers.map((entry) => (
                <li
                  key={entry.product!.id}
                  className="flex justify-between border-l-2 border-gold pl-3 text-sm leading-relaxed text-taupe"
                >
                  <span>{entry.product!.name}</span>
                  <span>{entry.quantity} sold</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
