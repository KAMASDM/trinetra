import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

const SESSION_COOKIE = "trinetra_session";

export type AdminSession = {
  uid: string;
  email: string | undefined;
};

export const verifySession = cache(async (): Promise<AdminSession | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (decoded.admin !== true) return null;
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
});

export { SESSION_COOKIE };
