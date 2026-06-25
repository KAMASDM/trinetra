import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { getOrderById, markOrderPaid } from "@/lib/data/orders";
import { upsertCustomerFromOrder } from "@/lib/data/customers";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { FieldValue } from "firebase-admin/firestore";

type VerifyPayload = {
  orderId: string;
  razorpayOrderId: string;
  paymentId: string;
  signature: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as VerifyPayload;

  if (!payload?.orderId || !payload?.razorpayOrderId || !payload?.paymentId || !payload?.signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const isValid = verifyPaymentSignature({
    orderId: payload.razorpayOrderId,
    paymentId: payload.paymentId,
    signature: payload.signature,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const order = await getOrderById(payload.orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paymentStatus !== "paid") {
    await markOrderPaid(payload.orderId, {
      razorpayOrderId: payload.razorpayOrderId,
      paymentId: payload.paymentId,
      signature: payload.signature,
    });

    await Promise.all(
      order.items.map((item) =>
        adminDb
          .collection("products")
          .doc(item.productId)
          .update({ inventory: FieldValue.increment(-item.quantity) }),
      ),
    );

    const paidOrder = await getOrderById(payload.orderId);
    if (paidOrder) await upsertCustomerFromOrder(paidOrder);

    revalidatePath("/shop");
    revalidatePath("/");
  }

  return NextResponse.json({ ok: true, orderId: payload.orderId });
}
