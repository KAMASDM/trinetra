import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { Customer, Order } from "@/lib/types";

const COLLECTION = "customers";

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === "number") return value;
  return Date.now();
}

function fromDoc(id: string, data: FirebaseFirestore.DocumentData): Customer {
  return {
    ...data,
    id,
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
    lastOrderAt: toMillis(data.lastOrderAt),
  } as Customer;
}

function customerDocId(email: string) {
  return email.trim().toLowerCase();
}

export async function upsertCustomerFromOrder(order: Order): Promise<void> {
  const id = customerDocId(order.customer.email);
  const ref = adminDb.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  const now = Date.now();

  if (!doc.exists) {
    await ref.set({
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      city: order.customer.city,
      address: order.customer.address,
      ...(order.uid ? { uid: order.uid } : {}),
      orderIds: [order.id],
      orderCount: 1,
      lifetimeValue: order.total,
      lastOrderAt: now,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return;
  }

  await ref.update({
    name: order.customer.name,
    phone: order.customer.phone,
    city: order.customer.city,
    address: order.customer.address,
    ...(order.uid ? { uid: order.uid } : {}),
    orderIds: FieldValue.arrayUnion(order.id),
    orderCount: FieldValue.increment(1),
    lifetimeValue: FieldValue.increment(order.total),
    lastOrderAt: now,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function getCustomerByUid(uid: string): Promise<Customer | null> {
  const snapshot = await adminDb.collection(COLLECTION).where("uid", "==", uid).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return fromDoc(doc.id, doc.data());
}

export async function listCustomers(): Promise<Customer[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("lastOrderAt", "desc").get();
  return snapshot.docs.map((doc) => fromDoc(doc.id, doc.data()));
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return fromDoc(doc.id, doc.data()!);
}
