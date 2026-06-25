import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/data/products";
import { attachRazorpayOrder, createOrder } from "@/lib/data/orders";
import { getRazorpayClient } from "@/lib/razorpay";
import { adminAuth } from "@/lib/firebase-admin";
import { isRecentlyVerified } from "@/lib/data/otp";
import type { OrderItem } from "@/lib/types";

type CheckoutCartItem = {
  productId: string;
  quantity: number;
  size: string;
  color: string;
};

type CheckoutPayload = {
  customer: { name: string; email: string; phone: string; city: string; address: string };
  notes?: string;
  items: CheckoutCartItem[];
  agreedToTerms: boolean;
  /** Fresh ID token from a signed-in (registered) customer — the account itself is the trust signal, so it satisfies both email + phone verification. */
  customerIdToken?: string;
  /** Guest path: ID token from a Firebase Phone Auth OTP confirmation, proving ownership of customer.phone without creating a visible account. */
  phoneIdToken?: string;
};

const SHIPPING_FLAT_RATE = 0;

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "").slice(-10);
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CheckoutPayload;

  if (!payload?.items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!payload.customer?.email || !payload.customer?.phone || !payload.customer?.name) {
    return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
  }
  if (payload.agreedToTerms !== true) {
    return NextResponse.json({ error: "You must agree to the Terms, Privacy Policy and Refund Policy" }, { status: 400 });
  }

  let uid: string | undefined;
  let verifiedEmail = false;
  let verifiedPhone = false;

  if (payload.customerIdToken) {
    try {
      const decoded = await adminAuth.verifyIdToken(payload.customerIdToken);
      uid = decoded.uid;
      verifiedEmail = true;
      verifiedPhone = true;
    } catch {
      return NextResponse.json({ error: "Your session expired, please sign in again" }, { status: 401 });
    }
  } else {
    verifiedEmail = await isRecentlyVerified("email", payload.customer.email);
    if (!verifiedEmail) {
      return NextResponse.json({ error: "Email is not verified" }, { status: 400 });
    }

    if (!payload.phoneIdToken) {
      return NextResponse.json({ error: "Phone is not verified" }, { status: 400 });
    }
    try {
      const decoded = await adminAuth.verifyIdToken(payload.phoneIdToken);
      const tokenPhone = normalizePhone(decoded.phone_number ?? "");
      const submittedPhone = normalizePhone(payload.customer.phone);
      if (!tokenPhone || tokenPhone !== submittedPhone) {
        return NextResponse.json({ error: "Phone verification does not match the submitted number" }, { status: 400 });
      }
      verifiedPhone = true;
    } catch {
      return NextResponse.json({ error: "Phone verification expired, please verify again" }, { status: 401 });
    }
  }

  const productMap = await getProductsByIds(payload.items.map((item) => item.productId));

  const items: OrderItem[] = [];
  for (const cartItem of payload.items) {
    const product = productMap.get(cartItem.productId);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${cartItem.productId}` }, { status: 400 });
    }
    if (cartItem.quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    if (product.inventory < cartItem.quantity) {
      return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 409 });
    }

    items.push({
      productId: product.id,
      name: product.name,
      price: product.price, // server-trusted price, never taken from the client
      quantity: cartItem.quantity,
      size: cartItem.size,
      color: cartItem.color,
      image: product.image,
    });
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  const orderId = await createOrder({
    customer: { ...payload.customer, verifiedEmail, verifiedPhone },
    notes: payload.notes,
    items,
    subtotal,
    shipping,
    total,
    uid,
  });

  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100), // paise
    currency: "INR",
    receipt: orderId,
    notes: { orderId },
  });

  await attachRazorpayOrder(orderId, razorpayOrder.id);

  return NextResponse.json({
    orderId,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
