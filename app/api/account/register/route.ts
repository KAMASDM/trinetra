import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { upsertCustomerProfile } from "@/lib/data/customers";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const { idToken, name, phone, isNewUser } = await request.json();

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const email = decoded.email;
    const resolvedName = name || decoded.name || email?.split("@")[0] || "there";

    if (email) {
      await upsertCustomerProfile({ uid: decoded.uid, email, name: resolvedName, phone });

      if (isNewUser) {
        try {
          await sendWelcomeEmail(email, resolvedName);
        } catch (error) {
          console.error("Failed to send welcome email", error);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to register account profile", error);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
