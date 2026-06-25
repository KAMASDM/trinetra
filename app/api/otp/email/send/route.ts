import { NextRequest, NextResponse } from "next/server";
import { createOtp } from "@/lib/data/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const code = await createOtp("email", email);

  try {
    await sendOtpEmail(email, code);
  } catch (error) {
    console.error("Failed to send OTP email", error);
    return NextResponse.json({ error: "Could not send verification email" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
