import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/data/products";
import { updateProductAction } from "@/app/admin/actions";

export const metadata = { title: "Edit Product | Admin | Trinetra" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const action = updateProductAction.bind(null, id, product.image);

  return (
    <div className="max-w-3xl">
      <p className="eyebrow-stitch mb-4">Catalog</p>
      <ProductForm action={action} product={product} />
    </div>
  );
}
