"use client";

import { useRef, useState, useTransition } from "react";
import Papa from "papaparse";
import { Upload, Loader2, FileWarning, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getProductImportMatchesAction,
  importProductsAction,
  type ProductImportResult,
} from "@/app/admin/actions";
import { csvRowToProductRecord, type ProductCsvRow } from "@/lib/csv/productCsv";
import { productDraftSchema } from "@/lib/validation/product";

type PreviewRow = {
  rowIndex: number;
  record: Record<string, unknown>;
  id?: string;
  slug: string;
  name: string;
  willAction: "create" | "update" | "error";
  error?: string;
};

export default function ProductImportClient() {
  const [previewRows, setPreviewRows] = useState<PreviewRow[] | null>(null);
  const [results, setResults] = useState<ProductImportResult[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setResults(null);
    Papa.parse<Partial<ProductCsvRow>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed) => {
        const rawRows = parsed.data;
        const parsedRows: PreviewRow[] = rawRows.map((raw, i) => {
          const record = csvRowToProductRecord(raw);
          try {
            const draft = productDraftSchema.parse(record);
            return {
              rowIndex: i,
              record,
              id: raw.id?.trim() || undefined,
              slug: draft.slug,
              name: draft.name || "(no name)",
              willAction: "create" as const,
            };
          } catch {
            return {
              rowIndex: i,
              record,
              id: raw.id?.trim() || undefined,
              slug: String(raw.slug ?? ""),
              name: String(raw.name ?? "(no name)"),
              willAction: "error" as const,
              error: "Could not parse this row.",
            };
          }
        });

        const slugs = parsedRows.map((r) => r.slug).filter(Boolean);
        const matches = await getProductImportMatchesAction(slugs);
        const resolved = parsedRows.map((row) => {
          if (row.willAction === "error") return row;
          const matchedId = row.id ?? matches[row.slug];
          return { ...row, id: matchedId, willAction: matchedId ? "update" : "create" } as PreviewRow;
        });

        setPreviewRows(resolved);
      },
      error: (err) => toast.error(`Could not read file: ${err.message}`),
    });
  }

  function commit() {
    if (!previewRows) return;
    const rows = previewRows
      .filter((r) => r.willAction !== "error")
      .map((r) => ({ rowIndex: r.rowIndex, id: r.id, record: r.record }));
    startTransition(async () => {
      const res = await importProductsAction(rows);
      setResults(res);
      const created = res.filter((r) => r.status === "created").length;
      const updated = res.filter((r) => r.status === "updated").length;
      const errored = res.filter((r) => r.status === "error").length;
      toast.success(`Import complete: ${created} created, ${updated} updated, ${errored} errors.`);
    });
  }

  function downloadResults() {
    if (!results) return;
    const csv = Papa.unparse(
      results.map((r) => ({ row: r.rowIndex + 1, identifier: r.identifier, status: r.status, message: r.message ?? "" })),
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trinetra-import-results.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const validCount = previewRows?.filter((r) => r.willAction !== "error").length ?? 0;

  return (
    <div className="space-y-6">
      <div className="rounded-md border-2 border-dashed border-border p-8 text-center">
        <Upload className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
        <p className="mb-3 text-sm text-muted-foreground">
          Upload a CSV exported from this admin (or matching the same column headers) to bulk create or update products.
        </p>
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          Choose CSV file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {previewRows && !results && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {validCount} of {previewRows.length} rows ready to import. Rows are always saved as drafts unless
              they already meet every requirement to publish.
            </p>
            <Button onClick={commit} disabled={isPending || validCount === 0}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Import {validCount} products
            </Button>
          </div>
          <div className="max-h-[480px] overflow-auto rounded-md border border-gold/20 bg-warm-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row) => (
                  <TableRow key={row.rowIndex}>
                    <TableCell>{row.rowIndex + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="text-muted-foreground">{row.slug || "—"}</TableCell>
                    <TableCell>
                      {row.willAction === "create" && <Badge variant="secondary">Will create</Badge>}
                      {row.willAction === "update" && <Badge>Will update</Badge>}
                      {row.willAction === "error" && (
                        <Badge variant="destructive" className="gap-1">
                          <FileWarning className="h-3 w-3" /> {row.error ?? "Error"}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {results && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-charcoal">Results</p>
            <Button variant="outline" size="sm" onClick={downloadResults}>
              Download results CSV
            </Button>
          </div>
          <div className="max-h-[480px] overflow-auto rounded-md border border-gold/20 bg-warm-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.rowIndex}>
                    <TableCell>{r.rowIndex + 1}</TableCell>
                    <TableCell>{r.identifier}</TableCell>
                    <TableCell>
                      {r.status === "error" ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : r.status === "downgraded" ? (
                        <Badge variant="secondary" className="gap-1">
                          <Circle className="h-3 w-3" /> Saved as draft
                        </Badge>
                      ) : (
                        <Badge className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {r.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.message ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
