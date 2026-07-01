import ExportProductsCsvButton from "@/components/admin/ExportProductsCsvButton";
import ProductImportClient from "./ProductImportClient";

export const metadata = { title: "Import / Export | Admin | Trinetra" };

export default function ProductImportPage() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow-stitch mb-4">Catalog</p>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="heading-stitched text-4xl">Import / Export</h1>
        <ExportProductsCsvButton />
      </div>
      <ProductImportClient />
    </div>
  );
}
