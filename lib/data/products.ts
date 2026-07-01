import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { Product } from "@/lib/types";

const COLLECTION = "products";

function toMillis(value: unknown): number | undefined {
  if (value instanceof Timestamp) return value.toMillis();
  return typeof value === "number" ? value : undefined;
}

function withoutUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as Partial<T>;
}

function withDefaults(id: string, data: FirebaseFirestore.DocumentData): Product {
  return {
    status: "published",
    ...data,
    gallery: Array.isArray(data.gallery) ? data.gallery : data.image ? [data.image] : [],
    craft: Array.isArray(data.craft) ? data.craft : [],
    colors: Array.isArray(data.colors) ? data.colors : [],
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
    id,
  } as Product;
}

export async function listPublishedProducts(): Promise<Product[]> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("status", "==", "published")
    .get();
  return snapshot.docs.map((doc) => withDefaults(doc.id, doc.data()));
}

export async function listAllProducts(): Promise<Product[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => withDefaults(doc.id, doc.data()));
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await listPublishedProducts();
  return products.filter((product) => product.bestseller || product.newArrival).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const snapshot = await adminDb.collection(COLLECTION).where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return withDefaults(doc.id, doc.data());
}

export async function getProductById(id: string): Promise<Product | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return withDefaults(doc.id, doc.data()!);
}

export async function getProductsByIds(ids: string[]): Promise<Map<string, Product>> {
  if (!ids.length) return new Map();
  const uniqueIds = [...new Set(ids)];
  const docs = await Promise.all(uniqueIds.map((id) => adminDb.collection(COLLECTION).doc(id).get()));
  const map = new Map<string, Product>();
  for (const doc of docs) {
    if (doc.exists) map.set(doc.id, withDefaults(doc.id, doc.data()!));
  }
  return map;
}

export async function getProductsBySlugs(slugs: string[]): Promise<Map<string, Product>> {
  const uniqueSlugs = [...new Set(slugs.filter(Boolean))];
  if (!uniqueSlugs.length) return new Map();
  const map = new Map<string, Product>();
  for (let i = 0; i < uniqueSlugs.length; i += 30) {
    const batch = uniqueSlugs.slice(i, i + 30);
    const snapshot = await adminDb.collection(COLLECTION).where("slug", "in", batch).get();
    for (const doc of snapshot.docs) {
      const product = withDefaults(doc.id, doc.data());
      map.set(product.slug, product);
    }
  }
  return map;
}

export async function listLowStockProducts(threshold = 5): Promise<Product[]> {
  const products = await listAllProducts();
  return products.filter((p) => p.status !== "archived" && p.inventory <= threshold);
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export async function createProduct(input: ProductInput): Promise<string> {
  const ref = await adminDb.collection(COLLECTION).add({
    ...withoutUndefined(input),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  await adminDb
    .collection(COLLECTION)
    .doc(id)
    .update({ ...withoutUndefined(input), updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}

export async function decrementInventory(id: string, quantity: number): Promise<void> {
  await adminDb
    .collection(COLLECTION)
    .doc(id)
    .update({ inventory: FieldValue.increment(-quantity) });
}

export type ProductAuditAction = "created" | "updated" | "deleted" | "bulk-updated" | "imported";

export type ProductAuditEntry = {
  id: string;
  action: ProductAuditAction;
  actorEmail?: string;
  note?: string;
  at: number;
};

export async function appendProductAuditLog(
  productId: string,
  entry: { action: ProductAuditAction; actorEmail?: string; note?: string },
): Promise<void> {
  await adminDb
    .collection(COLLECTION)
    .doc(productId)
    .collection("auditLog")
    .add({ ...entry, at: FieldValue.serverTimestamp() });
}

export async function listProductAuditLog(productId: string): Promise<ProductAuditEntry[]> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .doc(productId)
    .collection("auditLog")
    .orderBy("at", "desc")
    .limit(50)
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      action: data.action,
      actorEmail: data.actorEmail,
      note: data.note,
      at: toMillis(data.at) ?? Date.now(),
    };
  });
}
