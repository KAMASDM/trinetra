import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient(): Resend {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY env var.");
  client = new Resend(apiKey);
  return client;
}

export function getFromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("Missing RESEND_FROM_EMAIL env var.");
  return from;
}
