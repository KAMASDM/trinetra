"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileUp,
  PlusCircle,
  Search,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { searchAdminAction, type AdminSearchResult } from "@/app/admin/actions";

export default function AdminCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminSearchResult[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setPending(true);
      try {
        const data = await searchAdminAction(query.trim());
        setResults(data);
      } finally {
        setPending(false);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-full justify-start gap-2 text-muted-foreground sm:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search products, orders, customers…</span>
        <span className="sm:hidden">Search…</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Search products, orders, customers, or run a quick action…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!query && (
            <CommandGroup heading="Quick actions">
              <CommandItem onSelect={() => go("/admin/products/new")}>
                <PlusCircle /> New product
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/products/import")}>
                <FileUp /> Import / export products
              </CommandItem>
              <CommandItem onSelect={() => go("/admin")}>
                <LayoutDashboard /> Dashboard
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/products")}>
                <Package /> Products
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/orders")}>
                <ShoppingCart /> Orders
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/customers")}>
                <Users /> Customers
              </CommandItem>
            </CommandGroup>
          )}
          {query && (
            <>
              <CommandEmpty>{pending ? "Searching…" : "No results found."}</CommandEmpty>
              {(["product", "order", "customer"] as const).map((type) => {
                const group = results.filter((r) => r.type === type);
                if (!group.length) return null;
                return (
                  <CommandGroup key={type} heading={`${type[0].toUpperCase()}${type.slice(1)}s`}>
                    {group.map((r) => (
                      <CommandItem key={`${r.type}-${r.id}`} onSelect={() => go(r.href)}>
                        {r.type === "product" && <Package />}
                        {r.type === "order" && <ShoppingCart />}
                        {r.type === "customer" && <Users />}
                        <span>{r.title}</span>
                        {r.subtitle && (
                          <span className="ml-auto text-xs text-muted-foreground">{r.subtitle}</span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
            </>
          )}
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
