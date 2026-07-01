import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById, listProductAuditLog } from "@/lib/data/products";
import { updateProductAction } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Edit Product | Admin | Trinetra" };

const ACTION_LABEL: Record<string, string> = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
  "bulk-updated": "Bulk updated",
  imported: "Imported via CSV",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, auditLog] = await Promise.all([getProductById(id), listProductAuditLog(id)]);
  if (!product) notFound();

  const action = updateProductAction.bind(null, id);

  return (
    <div className="max-w-3xl">
      <p className="eyebrow-stitch mb-4">Catalog</p>
      <ProductForm action={action} product={product} />

      {auditLog.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-taupe">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {auditLog.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-baseline gap-x-2 border-l-2 border-gold/40 pl-3">
                  <span className="font-medium text-charcoal">{ACTION_LABEL[entry.action] ?? entry.action}</span>
                  {entry.note && <span className="text-muted-foreground">{entry.note}</span>}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {entry.actorEmail ?? "unknown"} · {new Date(entry.at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
