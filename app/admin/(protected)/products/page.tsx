import Link from "next/link";
import { Plus, FileUp } from "lucide-react";
import { listAllProducts } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductsDataTable from "@/components/admin/ProductsDataTable";

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
        <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/products/import" />}>
            <FileUp className="h-4 w-4" /> Import / Export
          </Button>
          <Button nativeButton={false} render={<Link href="/admin/products/new" />}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <Input name="q" defaultValue={q} placeholder="Search by name or slug" className="max-w-xs" />
        <Select name="status" defaultValue={status || undefined}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      <ProductsDataTable products={filtered} />
    </div>
  );
}
