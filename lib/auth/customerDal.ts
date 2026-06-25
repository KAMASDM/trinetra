import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

const CUSTOMER_SESSION_COOKIE = "trinetra_customer_session";

export type CustomerSession = {
  uid: string;
  email: string | undefined;
  phoneNumber: string | undefined;
  name: string | undefined;
};

export const verifyCustomerSession = cache(async (): Promise<CustomerSession | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email,
      phoneNumber: decoded.phone_number,
      name: decoded.name,
    };
  } catch {
    return null;
  }
});

export { CUSTOMER_SESSION_COOKIE };
