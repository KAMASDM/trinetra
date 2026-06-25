import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { Order, OrderCustomer, OrderItem, OrderStatus, OrderTimelineEntry, PaymentStatus } from "@/lib/types";

const COLLECTION = "orders";

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === "number") return value;
  return Date.now();
}

function fromDoc(id: string, data: FirebaseFirestore.DocumentData): Order {
  return {
    ...data,
    id,
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
    timeline: (data.timeline ?? []).map((entry: OrderTimelineEntry & { at: unknown }) => ({
      ...entry,
      at: toMillis(entry.at),
    })),
  } as Order;
}

export async function createOrder(input: {
  customer: OrderCustomer;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  uid?: string;
}): Promise<string> {
  const now = Date.now();
  const ref = await adminDb.collection(COLLECTION).add({
    customer: input.customer,
    notes: input.notes ?? "",
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    status: "new" satisfies OrderStatus,
    paymentStatus: "created" satisfies PaymentStatus,
    timeline: [{ status: "new", at: now }],
    ...(input.uid ? { uid: input.uid } : {}),
    agreedToTermsAt: now,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function listOrdersByUid(uid: string): Promise<Order[]> {
  const snapshot = await adminDb.collection(COLLECTION).where("uid", "==", uid).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => fromDoc(doc.id, doc.data()));
}

export async function attachRazorpayOrder(orderId: string, razorpayOrderId: string) {
  await adminDb
    .collection(COLLECTION)
    .doc(orderId)
    .update({
      razorpay: { orderId: razorpayOrderId },
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function markOrderPaid(
  orderId: string,
  payment: { razorpayOrderId: string; paymentId: string; signature: string },
) {
  const now = Date.now();
  await adminDb
    .collection(COLLECTION)
    .doc(orderId)
    .update({
      status: "confirmed" satisfies OrderStatus,
      paymentStatus: "paid" satisfies PaymentStatus,
      razorpay: payment,
      timeline: FieldValue.arrayUnion(
        { status: "payment_paid", at: now },
        { status: "confirmed", at: now },
      ),
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function markOrderPaymentFailed(orderId: string, reason?: string) {
  const now = Date.now();
  await adminDb
    .collection(COLLECTION)
    .doc(orderId)
    .update({
      paymentStatus: "failed" satisfies PaymentStatus,
      timeline: FieldValue.arrayUnion({ status: "payment_failed", at: now, note: reason ?? "" }),
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string,
  extra?: { trackingNumber?: string; courier?: string },
) {
  const now = Date.now();
  await adminDb
    .collection(COLLECTION)
    .doc(orderId)
    .update({
      status,
      ...(extra?.trackingNumber ? { trackingNumber: extra.trackingNumber } : {}),
      ...(extra?.courier ? { courier: extra.courier } : {}),
      timeline: FieldValue.arrayUnion({ status, at: now, note: note ?? "" }),
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function getOrderById(id: string): Promise<Order | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return fromDoc(doc.id, doc.data()!);
}

export async function getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("razorpay.orderId", "==", razorpayOrderId)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return fromDoc(doc.id, doc.data());
}

export async function findOrderForTracking(orderId: string, contact: string): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;
  const matches =
    order.customer.email.toLowerCase() === contact.toLowerCase() || order.customer.phone === contact;
  return matches ? order : null;
}

export async function getOrdersByIds(ids: string[]): Promise<Order[]> {
  if (!ids.length) return [];
  const docs = await Promise.all(ids.map((id) => adminDb.collection(COLLECTION).doc(id).get()));
  return docs
    .filter((doc) => doc.exists)
    .map((doc) => fromDoc(doc.id, doc.data()!))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function listOrders(filter?: { status?: OrderStatus; paymentStatus?: PaymentStatus }): Promise<Order[]> {
  let query: FirebaseFirestore.Query = adminDb.collection(COLLECTION);
  if (filter?.status) query = query.where("status", "==", filter.status);
  if (filter?.paymentStatus) query = query.where("paymentStatus", "==", filter.paymentStatus);
  const snapshot = await query.orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => fromDoc(doc.id, doc.data()));
}
