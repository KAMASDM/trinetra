"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/dal";
import { adminStorage } from "@/lib/firebase-admin";
import { createProduct, deleteProduct, updateProduct, type ProductInput } from "@/lib/data/products";
import { updateOrderStatus } from "@/lib/data/orders";
import type { OrderStatus, ProductCategory } from "@/lib/types";

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

function buildProductInput(form: FormData, existingImage?: string): Promise<ProductInput> | ProductInput {
  const buildWithImage = (image: string): ProductInput => ({
    name: String(form.get("name") ?? ""),
    slug: String(form.get("slug") ?? "").toLowerCase().trim(),
    category: form.get("category") as ProductCategory,
    price: Number(form.get("price")),
    compareAtPrice: form.get("compareAtPrice") ? Number(form.get("compareAtPrice")) : undefined,
    inventory: Number(form.get("inventory")),
    fabric: String(form.get("fabric") ?? ""),
    craft: splitList(form.get("craft")),
    sizes: splitList(form.get("sizes")),
    colors: splitList(form.get("colors")),
    dispatch: String(form.get("dispatch") ?? ""),
    care: String(form.get("care") ?? ""),
    story: String(form.get("story") ?? ""),
    description: String(form.get("description") ?? ""),
    seoTitle: String(form.get("seoTitle") ?? ""),
    seoDescription: String(form.get("seoDescription") ?? ""),
    status: (form.get("status") as ProductInput["status"]) ?? "draft",
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

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const input = await buildProductInput(formData);
  await createProduct(input);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(id: string, existingImage: string, formData: FormData) {
  await requireAdmin();
  const input = await buildProductInput(formData, existingImage);
  await updateProduct(id, input);
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
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("trinetra_session");
  redirect("/admin/login");
}
