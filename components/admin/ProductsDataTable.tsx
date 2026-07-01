"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProductAction, quickUpdateProductAction } from "@/app/admin/actions";
import { formatAdminDate, formatPrice, type Product, type ProductStatus } from "@/lib/types";
import BulkActionsBar from "@/components/admin/BulkActionsBar";

const STATUS_VARIANT: Record<ProductStatus, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
};

function SortButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" className="-ml-3 h-7 gap-1 px-2" onClick={onClick}>
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </Button>
  );
}

function InlineEditableNumber({ id, field, value }: { id: string; field: "price" | "inventory"; value: number }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function commit() {
    if (draft === String(value)) {
      setEditing(false);
      return;
    }
    startTransition(async () => {
      const result = await quickUpdateProductAction(id, field, draft);
      if (result.error) {
        toast.error(result.error);
        setDraft(String(value));
      } else {
        toast.success("Saved.");
        router.refresh();
      }
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="rounded px-1.5 py-1 text-left hover:bg-muted"
        onClick={() => setEditing(true)}
      >
        {field === "price" ? formatPrice(value) : value}
      </button>
    );
  }

  return (
    <Input
      autoFocus
      type="number"
      value={draft}
      disabled={isPending}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setDraft(String(value));
          setEditing(false);
        }
      }}
      className="h-8 w-24"
    />
  );
}

function InlineEditableStatus({ id, value }: { id: string; value: ProductStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function commit(next: string | null) {
    if (!next || next === value) return;
    startTransition(async () => {
      const result = await quickUpdateProductAction(id, "status", next);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Status updated.");
        router.refresh();
      }
    });
  }

  return (
    <Select defaultValue={value} onValueChange={commit} disabled={isPending}>
      <SelectTrigger size="sm" className="h-7 border-none bg-transparent p-0 shadow-none hover:bg-muted">
        <SelectValue>
          <Badge variant={STATUS_VARIANT[value]} className="capitalize">
            {value}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default function ProductsDataTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(Boolean(v))}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(Boolean(v))}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortButton label="Product" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => {
          const product = row.original;
          return (
            <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-3">
              {product.image && (
                <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded-sm border border-border">
                  <Image src={product.image} alt="" fill sizes="36px" className="object-cover object-top" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-charcoal">{product.name || "Untitled product"}</p>
                <p className="text-xs text-muted-foreground">{product.slug || "no-slug"}</p>
              </div>
            </Link>
          );
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <SortButton label="Category" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => <span className="text-sm text-taupe">{row.original.category || "—"}</span>,
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <SortButton label="Price" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => <InlineEditableNumber id={row.original.id} field="price" value={row.original.price} />,
      },
      {
        accessorKey: "inventory",
        header: ({ column }) => (
          <SortButton label="Inventory" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <InlineEditableNumber id={row.original.id} field="inventory" value={row.original.inventory} />
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortButton label="Status" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <InlineEditableStatus id={row.original.id} value={row.original.status ?? "draft"} />
        ),
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <SortButton label="Updated" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) =>
          row.original.updatedAt ? (
            <span className="text-xs text-muted-foreground">{formatAdminDate(row.original.updatedAt)}</span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={`/admin/products/${product.id}/edit`} />}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    if (!confirm(`Delete "${product.name || "this product"}"?`)) return;
                    deleteProductAction(product.id).then(() => {
                      toast.success("Product deleted.");
                      router.refresh();
                    });
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [router],
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <SlidersHorizontal className="h-3.5 w-3.5" /> Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <BulkActionsBar
        selectedIds={selectedIds}
        onDone={() => {
          setRowSelection({});
          router.refresh();
        }}
      />

      <div className="rounded-md border border-gold/20 bg-warm-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-taupe">
                  No products match.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {selectedIds.length > 0
            ? `${selectedIds.length} of ${table.getFilteredRowModel().rows.length} selected`
            : `${table.getFilteredRowModel().rows.length} products`}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
