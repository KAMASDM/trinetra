import type { Product } from "@/lib/types";

export const PRODUCT_CSV_COLUMNS = [
  "id",
  "slug",
  "name",
  "category",
  "status",
  "price",
  "compareAtPrice",
  "inventory",
  "image",
  "gallery",
  "badge",
  "story",
  "description",
  "fabric",
  "craft",
  "colors",
  "sizes",
  "dispatch",
  "care",
  "customizable",
  "bestseller",
  "newArrival",
  "seoTitle",
  "seoDescription",
] as const;

export type ProductCsvColumn = (typeof PRODUCT_CSV_COLUMNS)[number];
export type ProductCsvRow = Record<ProductCsvColumn, string>;

function bool(value: boolean | undefined) {
  return value ? "TRUE" : "FALSE";
}

export function productToCsvRow(product: Product): ProductCsvRow {
  return {
    id: product.id,
    slug: product.slug ?? "",
    name: product.name ?? "",
    category: product.category ?? "",
    status: product.status ?? "draft",
    price: String(product.price ?? ""),
    compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
    inventory: String(product.inventory ?? ""),
    image: product.image ?? "",
    gallery: (product.gallery ?? []).join("|"),
    badge: product.badge ?? "",
    story: product.story ?? "",
    description: product.description ?? "",
    fabric: product.fabric ?? "",
    craft: (product.craft ?? []).join("|"),
    colors: (product.colors ?? []).join("|"),
    sizes: (product.sizes ?? []).join("|"),
    dispatch: product.dispatch ?? "",
    care: product.care ?? "",
    customizable: bool(product.customizable),
    bestseller: bool(product.bestseller),
    newArrival: bool(product.newArrival),
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
  };
}

function pipeList(value: string | undefined): string[] {
  return (value ?? "")
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);
}

function toBool(value: string | undefined): boolean {
  return String(value ?? "").trim().toUpperCase() === "TRUE";
}

/** Converts a raw CSV row (string values) into the loose record shape that
 * `productDraftSchema` understands — the same shape the product form posts. */
export function csvRowToProductRecord(row: Partial<ProductCsvRow>): Record<string, unknown> {
  return {
    name: row.name ?? "",
    slug: row.slug ?? "",
    category: row.category ?? "",
    status: (row.status ?? "draft").trim().toLowerCase() || "draft",
    price: row.price ?? "",
    compareAtPrice: row.compareAtPrice ?? "",
    inventory: row.inventory ?? "",
    badge: row.badge ?? "",
    fabric: row.fabric ?? "",
    craft: pipeList(row.craft),
    sizes: pipeList(row.sizes),
    colors: pipeList(row.colors),
    dispatch: row.dispatch ?? "",
    care: row.care ?? "",
    story: row.story ?? "",
    description: row.description ?? "",
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
    image: row.image ?? "",
    gallery: pipeList(row.gallery),
    customizable: toBool(row.customizable),
    bestseller: toBool(row.bestseller),
    newArrival: toBool(row.newArrival),
  };
}
