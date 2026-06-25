import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/data/otp";

export async function POST(request: NextRequest) {
  const { email, code } = await request.json();
  if (!email || !code) {
    return NextResponse.json({ error: "Missing email or code" }, { status: 400 });
  }

  const isValid = await verifyOtp("email", email, String(code));
  if (!isValid) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
