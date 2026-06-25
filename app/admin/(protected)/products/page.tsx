import Link from "next/link";
import Image from "next/image";
import { listAllProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/products";
import { deleteProductAction } from "@/app/admin/actions";

export const metadata = { title: "Products | Admin | Trinetra" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "" } = await searchParams;
  const products = await listAllProducts();

  const filtered = products.filter((product) => {
    const matchesQuery = q
      ? product.name.toLowerCase().includes(q.toLowerCase()) || product.slug.includes(q.toLowerCase())
      : true;
    const matchesStatus = status ? product.status === status : true;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow-stitch mb-4">Catalog</p>
          <h1 className="heading-stitched text-4xl">Products</h1>
        </div>
        <Link href="/admin/products/new" className="btn-gold">Add Product</Link>
      </div>

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or slug"
          className="admin-input max-w-xs"
        />
        <select name="status" defaultValue={status} className="admin-input max-w-[180px]">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" className="btn-outline-gold !py-3 !px-5 text-xs">Filter</button>
      </form>

      <div className="border border-gold/20 bg-warm-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-left text-taupe uppercase text-[10px] tracking-[0.2em]">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Inventory</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-gold/10">
                <td className="p-4 flex items-center gap-3">
                  {product.image && (
                    <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden">
                      <Image src={product.image} alt="" fill sizes="36px" className="object-cover object-top" />
                    </div>
                  )}
                  <span className="text-charcoal">{product.name}</span>
                </td>
                <td className="p-4 text-taupe">{product.category}</td>
                <td className="p-4 text-charcoal">{formatPrice(product.price)}</td>
                <td className="p-4 text-charcoal">{product.inventory}</td>
                <td className="p-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-taupe">{product.status}</span>
                </td>
                <td className="p-4 text-right space-x-3 whitespace-nowrap">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-crimson text-xs uppercase tracking-[0.2em]">
                    Edit
                  </Link>
                  <form action={deleteProductAction.bind(null, product.id)} className="inline">
                    <button type="submit" className="text-taupe text-xs uppercase tracking-[0.2em] hover:text-crimson">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-taupe">No products match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
