"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/dal";
import { adminStorage } from "@/lib/firebase-admin";
import Papa from "papaparse";
import {
  appendProductAuditLog,
  createProduct,
  deleteProduct,
  getProductById,
  getProductsBySlugs,
  listAllProducts,
  updateProduct,
  type ProductInput,
} from "@/lib/data/products";
import { PRODUCT_CSV_COLUMNS, productToCsvRow } from "@/lib/csv/productCsv";
import { getOrderById, listOrders, updateOrderStatus } from "@/lib/data/orders";
import { listCustomers } from "@/lib/data/customers";
import { sendOrderStatusEmail } from "@/lib/email";
import { formatPrice, type OrderStatus, type ProductCategory, type ProductStatus } from "@/lib/types";
import {
  productDraftSchema,
  productPublishSchema,
  zodIssuesToFieldErrors,
  type ProductDraftInput,
} from "@/lib/validation/product";

export type ProductActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export type AdminSearchResult = {
  type: "product" | "order" | "customer";
  id: string;
  title: string;
  subtitle?: string;
  href: string;
};

export async function searchAdminAction(query: string): Promise<AdminSearchResult[]> {
  await requireAdmin();
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [products, orders, customers] = await Promise.all([
    listAllProducts(),
    listOrders(),
    listCustomers(),
  ]);

  const productResults: AdminSearchResult[] = products
    .filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
    .slice(0, 6)
    .map((p) => ({
      type: "product",
      id: p.id,
      title: p.name,
      subtitle: p.category,
      href: `/admin/products/${p.id}/edit`,
    }));

  const orderResults: AdminSearchResult[] = orders
    .filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q),
    )
    .slice(0, 6)
    .map((o) => ({
      type: "order",
      id: o.id,
      title: `Order ${o.id.slice(0, 8)} — ${o.customer.name}`,
      subtitle: formatPrice(o.total),
      href: `/admin/orders/${o.id}`,
    }));

  const customerResults: AdminSearchResult[] = customers
    .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .slice(0, 6)
    .map((c) => ({
      type: "customer",
      id: c.id,
      title: c.name,
      subtitle: c.email,
      href: `/admin/customers/${c.id}`,
    }));

  return [...productResults, ...orderResults, ...customerResults];
}

async function requireAdmin() {
  const session = await verifySession();
  if (!session) redirect("/admin/login");
  return session;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function uploadProductImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
  const bucket = adminStorage.bucket();
  const fileRef = bucket.file(filePath);
  await fileRef.save(buffer, { contentType: file.type });
  await fileRef.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

export async function uploadProductImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file was provided." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Image must be 5MB or smaller." };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Only JPEG, PNG or WebP images are allowed." };
  }
  try {
    const url = await uploadProductImage(file);
    return { url };
  } catch (error) {
    console.error("Image upload failed", error);
    return { error: "Image upload failed. Please try again." };
  }
}

function formDataToProductRecord(form: FormData): Record<string, unknown> {
  return {
    name: form.get("name"),
    slug: form.get("slug"),
    category: form.get("category"),
    status: form.get("status") || "draft",
    price: form.get("price"),
    compareAtPrice: form.get("compareAtPrice"),
    inventory: form.get("inventory"),
    badge: form.get("badge"),
    fabric: form.get("fabric"),
    craft: form.getAll("craft"),
    sizes: form.getAll("sizes"),
    colors: form.getAll("colors"),
    dispatch: form.get("dispatch"),
    care: form.get("care"),
    story: form.get("story"),
    description: form.get("description"),
    seoTitle: form.get("seoTitle"),
    seoDescription: form.get("seoDescription"),
    image: form.get("image"),
    gallery: form.getAll("gallery"),
    customizable: form.get("customizable") === "on",
    bestseller: form.get("bestseller") === "on",
    newArrival: form.get("newArrival") === "on",
  };
}

function draftToProductInput(draft: ProductDraftInput): ProductInput {
  return {
    name: draft.name,
    slug: draft.slug,
    category: (draft.category as ProductCategory) ?? ("" as ProductCategory),
    price: draft.price ?? 0,
    compareAtPrice: draft.compareAtPrice,
    image: draft.image ?? draft.gallery[0] ?? "",
    gallery: draft.gallery,
    badge: draft.badge || undefined,
    story: draft.story ?? "",
    description: draft.description ?? "",
    fabric: draft.fabric ?? "",
    craft: draft.craft,
    colors: draft.colors,
    sizes: draft.sizes,
    inventory: draft.inventory ?? 0,
    dispatch: draft.dispatch ?? "",
    customizable: draft.customizable,
    bestseller: draft.bestseller,
    newArrival: draft.newArrival,
    status: draft.status,
    seoTitle: draft.seoTitle || undefined,
    seoDescription: draft.seoDescription || undefined,
    care: draft.care ?? "",
  };
}

/** Parses + validates a product form. Always succeeds for drafts; only enforces the
 * full required-field checklist when the admin is flipping status to "published". */
function parseProductForm(form: FormData): ProductActionState | { input: ProductInput } {
  const record = formDataToProductRecord(form);
  const draft = productDraftSchema.parse(record);

  if (draft.status === "published") {
    const result = productPublishSchema.safeParse(record);
    if (!result.success) {
      return {
        error: "Complete the required fields before publishing — or save as a draft instead.",
        fieldErrors: zodIssuesToFieldErrors(result.error.issues),
      };
    }
  }

  return { input: draftToProductInput(draft) };
}

function productActionError(error: unknown): ProductActionState {
  console.error("Admin product action failed", error);
  return {
    error: error instanceof Error ? error.message : "Could not save the product. Please try again.",
  };
}

export async function createProductAction(_state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const session = await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!("input" in parsed)) return parsed;
  let id: string;
  try {
    id = await createProduct(parsed.input);
  } catch (error) {
    return productActionError(error);
  }
  await appendProductAuditLog(id, { action: "created", actorEmail: session.email });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _state: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!("input" in parsed)) return parsed;
  try {
    await updateProduct(id, parsed.input);
  } catch (error) {
    return productActionError(error);
  }
  await appendProductAuditLog(id, { action: "updated", actorEmail: session.email });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export type QuickEditField = "price" | "inventory" | "status";

export async function quickUpdateProductAction(
  id: string,
  field: QuickEditField,
  value: string,
): Promise<{ error?: string }> {
  await requireAdmin();
  try {
    if (field === "price") {
      const price = Number(value);
      if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price." };
      await updateProduct(id, { price });
    } else if (field === "inventory") {
      const inventory = Number(value);
      if (!Number.isFinite(inventory) || inventory < 0) return { error: "Enter a valid inventory quantity." };
      await updateProduct(id, { inventory });
    } else if (field === "status") {
      if (!["draft", "published", "archived"].includes(value)) return { error: "Invalid status." };
      await updateProduct(id, { status: value as ProductStatus });
    }
  } catch (error) {
    console.error("Quick edit failed", error);
    return { error: "Could not save. Please try again." };
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return {};
}

export async function bulkUpdateProductStatusAction(ids: string[], status: ProductStatus): Promise<{ count: number }> {
  const session = await requireAdmin();
  await Promise.all(
    ids.map(async (id) => {
      await updateProduct(id, { status });
      await appendProductAuditLog(id, {
        action: "bulk-updated",
        actorEmail: session.email,
        note: `Status set to ${status}`,
      });
    }),
  );
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { count: ids.length };
}

export async function bulkUpdateProductCategoryAction(
  ids: string[],
  category: ProductCategory,
): Promise<{ count: number }> {
  const session = await requireAdmin();
  await Promise.all(
    ids.map(async (id) => {
      await updateProduct(id, { category });
      await appendProductAuditLog(id, {
        action: "bulk-updated",
        actorEmail: session.email,
        note: `Category set to ${category}`,
      });
    }),
  );
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { count: ids.length };
}

export async function bulkAdjustPriceAction(
  ids: string[],
  adjustment: { type: "percent" | "flat"; value: number },
): Promise<{ count: number }> {
  const session = await requireAdmin();
  const products = await listAllProducts();
  const targets = products.filter((p) => ids.includes(p.id));
  await Promise.all(
    targets.map(async (p) => {
      const newPrice =
        adjustment.type === "percent"
          ? Math.max(0, Math.round(p.price * (1 + adjustment.value / 100)))
          : Math.max(0, p.price + adjustment.value);
      await updateProduct(p.id, { price: newPrice });
      await appendProductAuditLog(p.id, {
        action: "bulk-updated",
        actorEmail: session.email,
        note: `Price adjusted ${adjustment.type === "percent" ? `${adjustment.value}%` : `₹${adjustment.value}`} (₹${p.price} → ₹${newPrice})`,
      });
    }),
  );
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { count: targets.length };
}

export async function bulkDeleteProductsAction(ids: string[]): Promise<{ count: number }> {
  await requireAdmin();
  await Promise.all(ids.map((id) => deleteProduct(id)));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { count: ids.length };
}

const STATUS_NOTIFY: OrderStatus[] = ["packed", "shipped", "delivered", "cancelled", "returned"];

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  note?: string,
  trackingNumber?: string,
  courier?: string,
) {
  await requireAdmin();
  await updateOrderStatus(orderId, status, note, { trackingNumber, courier });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");

  if (STATUS_NOTIFY.includes(status)) {
    const order = await getOrderById(orderId);
    if (order) {
      try {
        await sendOrderStatusEmail(order.customer.email, {
          customerName: order.customer.name,
          orderId: order.id,
          status,
          trackingNumber: order.trackingNumber,
          courier: order.courier,
        });
      } catch (error) {
        console.error("Failed to send order status email", error);
      }
    }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("trinetra_session");
  redirect("/admin/login");
}

export async function exportProductsCsvAction(filters?: { status?: string; category?: string }): Promise<string> {
  await requireAdmin();
  let products = await listAllProducts();
  if (filters?.status) products = products.filter((p) => p.status === filters.status);
  if (filters?.category) products = products.filter((p) => p.category === filters.category);

  const rows = products.map(productToCsvRow);
  return Papa.unparse({
    fields: [...PRODUCT_CSV_COLUMNS],
    data: rows.map((row) => PRODUCT_CSV_COLUMNS.map((col) => row[col])),
  });
}

export async function getProductImportMatchesAction(slugs: string[]): Promise<Record<string, string>> {
  await requireAdmin();
  const map = await getProductsBySlugs(slugs);
  const result: Record<string, string> = {};
  for (const [slug, product] of map) result[slug] = product.id;
  return result;
}

export type ProductImportRow = {
  rowIndex: number;
  id?: string;
  record: Record<string, unknown>;
};

export type ProductImportResult = {
  rowIndex: number;
  identifier: string;
  status: "created" | "updated" | "downgraded" | "error";
  message?: string;
};

export async function importProductsAction(rows: ProductImportRow[]): Promise<ProductImportResult[]> {
  const session = await requireAdmin();
  const slugs = rows.map((r) => String(r.record.slug ?? "")).filter(Boolean);
  const existingBySlug = await getProductsBySlugs(slugs);

  const results: ProductImportResult[] = [];
  for (const row of rows) {
    const slug = String(row.record.slug ?? "");
    const identifier = slug || row.id || `row ${row.rowIndex + 1}`;
    try {
      const draft = productDraftSchema.parse(row.record);
      let status = draft.status;
      let downgraded = false;
      if (status === "published") {
        const check = productPublishSchema.safeParse(row.record);
        if (!check.success) {
          status = "draft";
          downgraded = true;
        }
      }
      const input = draftToProductInput({ ...draft, status });
      const existing = row.id ? await getProductById(row.id) : existingBySlug.get(draft.slug);

      let productId: string;
      if (existing) {
        await updateProduct(existing.id, input);
        productId = existing.id;
      } else {
        productId = await createProduct(input);
      }
      await appendProductAuditLog(productId, {
        action: "imported",
        actorEmail: session.email,
        note: `CSV import row ${row.rowIndex + 1}`,
      });

      results.push({
        rowIndex: row.rowIndex,
        identifier,
        status: downgraded ? "downgraded" : existing ? "updated" : "created",
        message: downgraded
          ? "Requested publish but required fields were missing — saved as draft instead."
          : undefined,
      });
    } catch (error) {
      console.error("Import row failed", row.rowIndex, error);
      results.push({
        rowIndex: row.rowIndex,
        identifier,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error.",
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return results;
}
