import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { getOrderById, getOrderByRazorpayOrderId, markOrderPaid, markOrderPaymentFailed } from "@/lib/data/orders";
import { upsertCustomerFromOrder } from "@/lib/data/customers";
import { verifyWebhookSignature } from "@/lib/razorpay";

// Durable backstop for /api/checkout/verify — handles the case where the
// browser closes before the client-side verify call completes.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const payment = event.payload?.payment?.entity;
  const razorpayOrderId: string | undefined = payment?.order_id;

  if (!razorpayOrderId) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const order = await getOrderByRazorpayOrderId(razorpayOrderId);
  if (!order) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (event.event === "payment.captured") {
    if (order.paymentStatus !== "paid") {
      await markOrderPaid(order.id, {
        razorpayOrderId,
        paymentId: payment.id,
        signature,
      });

      await Promise.all(
        order.items.map((item) =>
          adminDb
            .collection("products")
            .doc(item.productId)
            .update({ inventory: FieldValue.increment(-item.quantity) }),
        ),
      );

      const paidOrder = await getOrderById(order.id);
      if (paidOrder) await upsertCustomerFromOrder(paidOrder);

      revalidatePath("/shop");
      revalidatePath("/");
    }
  } else if (event.event === "payment.failed") {
    await markOrderPaymentFailed(order.id, payment?.error_description);
  }

  return NextResponse.json({ ok: true });
}
