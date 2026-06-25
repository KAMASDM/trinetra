import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY env var.");
  return new Resend(apiKey);
}

export async function sendOtpEmail(to: string, code: string) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("Missing RESEND_FROM_EMAIL env var.");

  const resend = getResendClient();
  await resend.emails.send({
    from,
    to,
    subject: `${code} is your Trinetra verification code`,
    html: `
      <div style="font-family: serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <p style="letter-spacing: 0.2em; text-transform: uppercase; font-size: 11px; color: #8B1A1A;">Trinetra By Rajababu</p>
        <h1 style="font-size: 28px; color: #1E1610;">Your verification code</h1>
        <p style="font-size: 32px; letter-spacing: 0.3em; color: #C9922A; font-weight: bold;">${code}</p>
        <p style="color: #7A6A5A; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}
