import { NextRequest, NextResponse } from "next/server";
import { isRecentlyVerified } from "@/lib/data/otp";
import { sendConsultationRequestEmails } from "@/lib/email";
import { consultationTypes } from "@/lib/consultation";

export async function POST(request: NextRequest) {
  const { name, email, phone, consultationType, notes } = await request.json();

  if (!name || !email || !phone || !consultationType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!consultationTypes.includes(consultationType)) {
    return NextResponse.json({ error: "Invalid consultation type" }, { status: 400 });
  }

  const emailVerified = await isRecentlyVerified("email", email);
  if (!emailVerified) {
    return NextResponse.json({ error: "Email is not verified" }, { status: 400 });
  }

  try {
    await sendConsultationRequestEmails({
      name: String(name),
      email: String(email),
      phone: String(phone),
      consultationType: String(consultationType),
      notes: notes ? String(notes) : undefined,
    });
  } catch (error) {
    console.error("Failed to send consultation request emails", error);
    return NextResponse.json({ error: "Could not send your request. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
