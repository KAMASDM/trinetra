"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/dal";
import { adminStorage } from "@/lib/firebase-admin";
import { createProduct, deleteProduct, updateProduct, type ProductInput } from "@/lib/data/products";
import { getOrderById, updateOrderStatus } from "@/lib/data/orders";
import { sendOrderStatusEmail } from "@/lib/email";
import { productCategories, type OrderStatus, type ProductCategory, type ProductStatus } from "@/lib/types";

export type ProductActionState = {
  error?: string;
};

async function requireAdmin() {
  const session = await verifySession();
  if (!session) redirect("/admin/login");
  return session;
}

async function uploadProductImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `products/${Date.now()}-${file.name}`;
  const bucket = adminStorage.bucket();
  const fileRef = bucket.file(filePath);
  await fileRef.save(buffer, { contentType: file.type });
  await fileRef.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

function splitList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readString(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function readNumber(form: FormData, key: string) {
  const value = Number(form.get(key));
  return Number.isFinite(value) ? value : 0;
}

function readOptionalNumber(form: FormData, key: string) {
  const raw = readString(form, key);
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

function readCategory(form: FormData): ProductCategory {
  const category = readString(form, "category") as ProductCategory;
  if (!productCategories.includes(category)) {
    throw new Error("Choose a valid product category.");
  }
  return category;
}

function readStatus(form: FormData): ProductStatus {
  const status = readString(form, "status") || "draft";
  if (!["draft", "published", "archived"].includes(status)) {
    throw new Error("Choose a valid publishing status.");
  }
  return status as ProductStatus;
}

function buildProductInput(form: FormData, existingImage?: string): Promise<ProductInput> | ProductInput {
  const buildWithImage = (image: string): ProductInput => ({
    name: readString(form, "name"),
    slug: readString(form, "slug").toLowerCase(),
    category: readCategory(form),
    price: readNumber(form, "price"),
    compareAtPrice: readOptionalNumber(form, "compareAtPrice"),
    inventory: readNumber(form, "inventory"),
    badge: readString(form, "badge") || undefined,
    fabric: readString(form, "fabric"),
    craft: splitList(form.get("craft")),
    sizes: splitList(form.get("sizes")),
    colors: splitList(form.get("colors")),
    dispatch: readString(form, "dispatch"),
    care: readString(form, "care"),
    story: readString(form, "story"),
    description: readString(form, "description"),
    seoTitle: readString(form, "seoTitle") || undefined,
    seoDescription: readString(form, "seoDescription") || undefined,
    status: readStatus(form),
    image,
    gallery: image ? [image] : [],
    customizable: form.get("customizable") === "on",
    bestseller: form.get("bestseller") === "on",
    newArrival: form.get("newArrival") === "on",
  });

  const imageFile = form.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    return uploadProductImage(imageFile).then(buildWithImage);
  }
  return buildWithImage(existingImage ?? "");
}

function validateProductInput(input: ProductInput) {
  if (!input.name) throw new Error("Product name is required.");
  if (!input.slug) throw new Error("URL slug is required.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    throw new Error("URL slug can only contain lowercase letters, numbers and hyphens.");
  }
  if (input.price <= 0) throw new Error("Selling price must be greater than zero.");
  if (input.inventory < 0) throw new Error("Inventory cannot be negative.");
  if (!input.image) throw new Error("Please upload a main image before saving the product.");
  if (!input.story) throw new Error("Short story is required.");
  if (!input.description) throw new Error("Full description is required.");
}

function productActionError(error: unknown): ProductActionState {
  console.error("Admin product action failed", error);
  return {
    error: error instanceof Error ? error.message : "Could not save the product. Please try again.",
  };
}

export async function createProductAction(_state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  await requireAdmin();
  try {
    const input = await buildProductInput(formData);
    validateProductInput(input);
    await createProduct(input);
  } catch (error) {
    return productActionError(error);
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  existingImage: string,
  _state: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  try {
    const input = await buildProductInput(formData, existingImage);
    validateProductInput(input);
    await updateProduct(id, input);
  } catch (error) {
    return productActionError(error);
  }
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
