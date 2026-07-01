"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, X } from "lucide-react";
import { productCategories, type ProductStatus, type ProductCategory } from "@/lib/types";
import {
  bulkUpdateProductStatusAction,
  bulkUpdateProductCategoryAction,
  bulkAdjustPriceAction,
  bulkDeleteProductsAction,
} from "@/app/admin/actions";

type BulkActionsBarProps = {
  selectedIds: string[];
  onDone: () => void;
};

export default function BulkActionsBar({ selectedIds, onDone }: BulkActionsBarProps) {
  const [isPending, startTransition] = useTransition();
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceType, setPriceType] = useState<"percent" | "flat">("percent");
  const [priceValue, setPriceValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (selectedIds.length === 0) return null;

  function runStatus(status: ProductStatus) {
    startTransition(async () => {
      const { count } = await bulkUpdateProductStatusAction(selectedIds, status);
      toast.success(`${count} product${count === 1 ? "" : "s"} marked ${status}.`);
      onDone();
    });
  }

  function runCategory(category: ProductCategory) {
    startTransition(async () => {
      const { count } = await bulkUpdateProductCategoryAction(selectedIds, category);
      toast.success(`${count} product${count === 1 ? "" : "s"} moved to ${category}.`);
      onDone();
    });
  }

  function runPriceAdjust() {
    const value = Number(priceValue);
    if (!Number.isFinite(value)) {
      toast.error("Enter a valid number.");
      return;
    }
    startTransition(async () => {
      const { count } = await bulkAdjustPriceAction(selectedIds, { type: priceType, value });
      toast.success(`Updated price on ${count} product${count === 1 ? "" : "s"}.`);
      setPriceDialogOpen(false);
      setPriceValue("");
      onDone();
    });
  }

  function runDelete() {
    startTransition(async () => {
      const { count } = await bulkDeleteProductsAction(selectedIds);
      toast.success(`${count} product${count === 1 ? "" : "s"} deleted.`);
      setDeleteDialogOpen(false);
      onDone();
    });
  }

  return (
    <>
      <div className="sticky top-16 z-10 mb-4 flex flex-wrap items-center gap-2 rounded-md border border-gold/30 bg-warm-white px-4 py-3 shadow-sm">
        <span className="text-sm font-medium text-charcoal">
          {selectedIds.length} selected
        </span>
        <div className="ml-2 flex flex-wrap gap-2">
          <Select onValueChange={(v) => runStatus(v as ProductStatus)}>
            <SelectTrigger size="sm" disabled={isPending}>
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Mark draft</SelectItem>
              <SelectItem value="published">Publish</SelectItem>
              <SelectItem value="archived">Archive</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => runCategory(v as ProductCategory)}>
            <SelectTrigger size="sm" disabled={isPending}>
              <SelectValue placeholder="Move to category" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" disabled={isPending} onClick={() => setPriceDialogOpen(true)}>
            Adjust price
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
        <Button variant="ghost" size="icon-sm" className="ml-auto" onClick={onDone}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust price for {selectedIds.length} products</DialogTitle>
            <DialogDescription>
              Apply a percentage or flat amount change. Prices never go below ₹0.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3">
            <Select value={priceType} onValueChange={(v) => setPriceType(v as "percent" | "flat")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percent (%)</SelectItem>
                <SelectItem value="flat">Flat (₹)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder={priceType === "percent" ? "e.g. -10 for 10% off" : "e.g. 200 or -200"}
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPriceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={runPriceAdjust} disabled={isPending || !priceValue}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.length} products?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={runDelete} disabled={isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
