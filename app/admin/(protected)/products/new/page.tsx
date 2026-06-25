import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/app/admin/actions";

export const metadata = { title: "New Product | Admin | Trinetra" };

export default function NewProductPage() {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow-stitch mb-4">Catalog</p>
      <ProductForm action={createProductAction} />
    </div>
  );
}
