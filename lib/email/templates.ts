const SITE_URL = "https://trinetrastudio.in";
const LOGO_URL = `${SITE_URL}/logo.png`;

const COLORS = {
  crimson: "#8B1A1A",
  gold: "#E6B400",
  goldLight: "#F7D154",
  ivory: "#FAF6EE",
  charcoal: "#1E1610",
  taupe: "#7A6A5A",
};

function layout({ preheader, bodyHtml }: { preheader: string; bodyHtml: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Trinetra By Rajababu</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.ivory};font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.ivory};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#FFFDF8;border:1px solid rgba(201,146,42,0.25);">
          <tr>
            <td style="background-color:${COLORS.charcoal};padding:28px 32px;text-align:center;">
              <img src="${LOGO_URL}" alt="Trinetra" width="48" height="48" style="display:inline-block;margin-bottom:10px;" />
              <div style="color:${COLORS.gold};font-size:20px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">Trinetra</div>
              <div style="color:rgba(247,209,84,0.7);font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">By Rajababu</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;color:${COLORS.charcoal};font-size:15px;line-height:1.7;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:${COLORS.charcoal};padding:24px 32px;text-align:center;">
              <div style="color:rgba(255,253,248,0.5);font-size:11px;letter-spacing:1px;">
                Trinetra By Rajababu &middot; Heritage Couture & Ethnic Wear
              </div>
              <div style="margin-top:10px;">
                <a href="${SITE_URL}/shop" style="color:${COLORS.gold};font-size:11px;text-decoration:none;margin:0 8px;">Shop</a>
                <a href="${SITE_URL}/track-order" style="color:${COLORS.gold};font-size:11px;text-decoration:none;margin:0 8px;">Track Order</a>
                <a href="${SITE_URL}/terms" style="color:${COLORS.gold};font-size:11px;text-decoration:none;margin:0 8px;">Terms</a>
                <a href="${SITE_URL}/privacy" style="color:${COLORS.gold};font-size:11px;text-decoration:none;margin:0 8px;">Privacy</a>
              </div>
              <div style="color:rgba(255,253,248,0.3);font-size:10px;margin-top:14px;">
                &copy; ${new Date().getFullYear()} Trinetra By Rajababu. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 18px;font-size:24px;color:${COLORS.crimson};font-weight:normal;letter-spacing:1px;">${text}</h1>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:8px;padding:12px 28px;background:linear-gradient(135deg,${COLORS.gold},${COLORS.goldLight});color:${COLORS.charcoal};text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">${label}</a>`;
}

function divider(): string {
  return `<div style="height:1px;background:linear-gradient(90deg,transparent,rgba(201,146,42,0.4),transparent);margin:24px 0;"></div>`;
}

export function otpEmail(code: string): { subject: string; html: string } {
  return {
    subject: `${code} is your Trinetra verification code`,
    html: layout({
      preheader: `Your verification code is ${code}`,
      bodyHtml: `
        ${heading("Your Verification Code")}
        <p>Use the code below to verify your email address at Trinetra By Rajababu.</p>
        <div style="text-align:center;margin:28px 0;">
          <span style="display:inline-block;font-size:34px;letter-spacing:10px;color:${COLORS.gold};font-weight:bold;">${code}</span>
        </div>
        <p style="color:${COLORS.taupe};font-size:13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
      `,
    }),
  };
}

export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: "Welcome to Trinetra By Rajababu",
    html: layout({
      preheader: "Your account is ready — welcome to the atelier",
      bodyHtml: `
        ${heading(`Welcome, ${name}`)}
        <p>Thank you for creating an account with Trinetra By Rajababu. You now have a home for your order history, faster checkout, and first access to new collections.</p>
        ${divider()}
        <p style="font-style:italic;color:${COLORS.taupe};">Where India's richest traditions are woven into every thread.</p>
        <div style="text-align:center;margin-top:24px;">
          ${button("https://trinetrastudio.in/shop", "Explore The Atelier")}
        </div>
      `,
    }),
  };
}

type OrderItemSummary = { name: string; quantity: number; price: number; size: string; color: string };

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function itemsTable(items: OrderItemSummary[]): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid rgba(201,146,42,0.15);font-size:13px;">
          ${item.name}<br/>
          <span style="color:${COLORS.taupe};font-size:11px;">${item.size} / ${item.color} &middot; Qty ${item.quantity}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid rgba(201,146,42,0.15);font-size:13px;text-align:right;">${formatInr(item.price * item.quantity)}</td>
      </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

export function orderConfirmationEmail(params: {
  customerName: string;
  orderId: string;
  items: OrderItemSummary[];
  total: number;
}): { subject: string; html: string } {
  const shortId = params.orderId.slice(-8).toUpperCase();
  return {
    subject: `Order Confirmed #${shortId} — Trinetra By Rajababu`,
    html: layout({
      preheader: `Your order #${shortId} has been confirmed`,
      bodyHtml: `
        ${heading(`Thank You, ${params.customerName.split(" ")[0]}`)}
        <p>Your order <strong>#${shortId}</strong> has been confirmed and payment received. Our team will reach out if any measurement or styling consultation is needed.</p>
        ${divider()}
        ${itemsTable(params.items)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
          <tr>
            <td style="font-size:16px;color:${COLORS.crimson};font-weight:bold;">Total Paid</td>
            <td style="font-size:16px;color:${COLORS.crimson};font-weight:bold;text-align:right;">${formatInr(params.total)}</td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:28px;">
          ${button(`https://trinetrastudio.in/track-order?orderId=${params.orderId}`, "Track This Order")}
        </div>
      `,
    }),
  };
}

const STATUS_COPY: Record<string, string> = {
  confirmed: "Your order has been confirmed and is being prepared.",
  packed: "Your order has been packed and is ready for dispatch.",
  shipped: "Your order is on its way to you.",
  delivered: "Your order has been delivered. We hope you love it.",
  cancelled: "Your order has been cancelled.",
  returned: "Your return has been processed.",
};

export function orderStatusEmail(params: {
  customerName: string;
  orderId: string;
  status: string;
  trackingNumber?: string;
  courier?: string;
}): { subject: string; html: string } {
  const shortId = params.orderId.slice(-8).toUpperCase();
  const statusLabel = params.status.charAt(0).toUpperCase() + params.status.slice(1);
  const copy = STATUS_COPY[params.status] ?? `Your order status has been updated to ${params.status}.`;
  return {
    subject: `Order #${shortId} — ${statusLabel}`,
    html: layout({
      preheader: copy,
      bodyHtml: `
        ${heading(`Order ${statusLabel}`)}
        <p>Hi ${params.customerName.split(" ")[0]}, ${copy}</p>
        ${
          params.trackingNumber
            ? `<p style="margin-top:16px;">Tracking number: <strong>${params.trackingNumber}</strong>${params.courier ? ` via ${params.courier}` : ""}</p>`
            : ""
        }
        <div style="text-align:center;margin-top:28px;">
          ${button(`https://trinetrastudio.in/track-order?orderId=${params.orderId}`, "Track This Order")}
        </div>
      `,
    }),
  };
}
