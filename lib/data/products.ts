import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { Product } from "@/lib/types";

const COLLECTION = "products";

function withDefaults(id: string, data: FirebaseFirestore.DocumentData): Product {
  return {
    status: "published",
    ...data,
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

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export async function createProduct(input: ProductInput): Promise<string> {
  const ref = await adminDb.collection(COLLECTION).add({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  await adminDb
    .collection(COLLECTION)
    .doc(id)
    .update({ ...input, updatedAt: FieldValue.serverTimestamp() });
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
