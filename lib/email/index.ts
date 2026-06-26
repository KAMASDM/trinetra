import { getResendClient, getFromAddress } from "./transport";
import { otpEmail, welcomeEmail, orderConfirmationEmail, orderStatusEmail } from "./templates";

export async function sendOtpEmail(to: string, code: string) {
  const { subject, html } = otpEmail(code);
  await getResendClient().emails.send({ from: getFromAddress(), to, subject, html });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const { subject, html } = welcomeEmail(name);
  await getResendClient().emails.send({ from: getFromAddress(), to, subject, html });
}

export async function sendOrderConfirmationEmail(
  to: string,
  params: {
    customerName: string;
    orderId: string;
    items: { name: string; quantity: number; price: number; size: string; color: string }[];
    total: number;
  },
) {
  const { subject, html } = orderConfirmationEmail(params);
  await getResendClient().emails.send({ from: getFromAddress(), to, subject, html });
}

export async function sendOrderStatusEmail(
  to: string,
  params: { customerName: string; orderId: string; status: string; trackingNumber?: string; courier?: string },
) {
  const { subject, html } = orderStatusEmail(params);
  await getResendClient().emails.send({ from: getFromAddress(), to, subject, html });
}
