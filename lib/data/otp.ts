import "server-only";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import type { OtpPurpose, OtpRecord } from "@/lib/types";

const COLLECTION = "otp_codes";
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const VERIFIED_TTL_MS = 30 * 60 * 1000; // verification stays valid for 30 minutes
const MAX_ATTEMPTS = 5;

function docId(purpose: OtpPurpose, identifier: string) {
  return `${purpose}:${identifier.trim().toLowerCase()}`;
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function generateCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function createOtp(purpose: OtpPurpose, identifier: string): Promise<string> {
  const code = generateCode();
  const record: OtpRecord = {
    codeHash: hashCode(code),
    expiresAt: Date.now() + CODE_TTL_MS,
    attempts: 0,
  };
  await adminDb.collection(COLLECTION).doc(docId(purpose, identifier)).set(record);
  return code;
}

export async function verifyOtp(purpose: OtpPurpose, identifier: string, code: string): Promise<boolean> {
  const ref = adminDb.collection(COLLECTION).doc(docId(purpose, identifier));
  const doc = await ref.get();
  if (!doc.exists) return false;

  const record = doc.data() as OtpRecord;
  if (record.attempts >= MAX_ATTEMPTS) return false;
  if (record.expiresAt < Date.now()) return false;

  const isValid = record.codeHash === hashCode(code);
  if (!isValid) {
    await ref.update({ attempts: record.attempts + 1 });
    return false;
  }

  await ref.update({ verifiedAt: Date.now() });
  return true;
}

export async function isRecentlyVerified(purpose: OtpPurpose, identifier: string): Promise<boolean> {
  const doc = await adminDb.collection(COLLECTION).doc(docId(purpose, identifier)).get();
  if (!doc.exists) return false;
  const record = doc.data() as OtpRecord;
  return Boolean(record.verifiedAt && record.verifiedAt > Date.now() - VERIFIED_TTL_MS);
}
