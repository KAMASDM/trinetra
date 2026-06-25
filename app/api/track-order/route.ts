import { NextRequest, NextResponse } from "next/server";
import { findOrderForTracking } from "@/lib/data/orders";

export async function POST(request: NextRequest) {
  const { orderId, contact } = await request.json();
  if (!orderId || !contact) {
    return NextResponse.json({ error: "Missing orderId or contact" }, { status: 400 });
  }

  const order = await findOrderForTracking(orderId, contact);
  if (!order) {
    return NextResponse.json({ error: "No matching order found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
