"use client";

import { useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportProductsCsvAction } from "@/app/admin/actions";

export default function ExportProductsCsvButton() {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const csv = await exportProductsCsvAction();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `trinetra-products-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={isPending}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Export catalog to CSV
    </Button>
  );
}
