import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = { title: "Privacy Policy | Trinetra By Rajababu" };

export default function PrivacyPage() {
  return (
    <LegalLayout eyebrow="Legal" title="Privacy Policy" updatedAt={new Date().toLocaleDateString("en-IN")}>
      <p>
        This Privacy Policy explains what information Trinetra By Rajababu collects when you use this website, and
        how it is used and protected.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        When you browse, register, or place an order, we may collect: your name, email address, phone number,
        delivery address, order and payment details, and measurements or styling notes you provide for
        customization. If you sign in with Google, we receive your name, email and profile photo from Google.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use this information to process and fulfil your orders, verify your identity at checkout (via email and
        phone OTP), communicate order updates, maintain your order history if you register an account, and improve
        our products and service.
      </p>

      <h2>3. Payment Information</h2>
      <p>
        Payments are processed by Razorpay. We do not store your card, UPI or bank details on our servers — these
        are handled directly by Razorpay under its own security standards and privacy practices.
      </p>

      <h2>4. Verification Codes (OTP)</h2>
      <p>
        Email verification codes are sent via our email provider (Resend) and phone verification codes via Firebase
        Phone Authentication (Google). These codes are short-lived and used only to confirm you own the email/phone
        you provided.
      </p>

      <h2>5. Data Sharing</h2>
      <p>
        We do not sell your personal information. We share the minimum necessary data with service providers who
        help us operate the site — payment processing (Razorpay), authentication and database hosting (Firebase /
        Google Cloud), and email delivery (Resend) — solely for the purpose of providing our service.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain order and account information for as long as needed to fulfil orders, comply with legal and tax
        obligations, and resolve disputes.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information by writing to us at{" "}
        <a className="text-crimson underline" href="mailto:hello@trinetra.in">hello@trinetra.in</a>. Deleting your
        account does not affect orders already placed, which we retain for accounting purposes.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use essential cookies to keep you signed in (for registered accounts) and to remember your cart. We do
        not use third-party advertising cookies.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time; the &ldquo;Last updated&rdquo; date above will reflect the latest revision.</p>

      <h2>10. Contact</h2>
      <p>
        For privacy questions, write to{" "}
        <a className="text-crimson underline" href="mailto:hello@trinetra.in">hello@trinetra.in</a>.
      </p>
    </LegalLayout>
  );
}
