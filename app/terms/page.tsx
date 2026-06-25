import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = { title: "Terms & Conditions | Trinetra By Rajababu" };

export default function TermsPage() {
  return (
    <LegalLayout eyebrow="Legal" title="Terms & Conditions" updatedAt={new Date().toLocaleDateString("en-IN")}>
      <p>
        These Terms & Conditions (&ldquo;Terms&rdquo;) govern your use of the Trinetra By Rajababu website and your
        purchase of any products listed on it. By placing an order, creating an account, or otherwise using this
        site, you agree to these Terms in full.
      </p>

      <h2>1. Products & Pricing</h2>
      <p>
        Many of our pieces are made-to-measure or made-to-order couture, hand-crafted by artisans. Prices, fabric,
        embellishment and dispatch timelines shown on the site are accurate at the time of listing but may vary
        slightly due to the handmade nature of the work. We reserve the right to correct pricing or availability
        errors before an order is confirmed.
      </p>

      <h2>2. Orders & Payment</h2>
      <p>
        All payments are processed securely through Razorpay. An order is confirmed only once payment is
        successfully captured. We verify the email and/or phone number provided at checkout before an order can be
        placed, whether you check out as a guest or as a registered account holder.
      </p>

      <h2>3. Accounts</h2>
      <p>
        You may check out as a guest or register an account (via Google, email, or phone). Registered accounts let
        you view your order history. You are responsible for keeping your account credentials confidential and for
        all activity under your account.
      </p>

      <h2>4. Customisation & Made-to-Measure Orders</h2>
      <p>
        For made-to-measure and customizable pieces, measurements and customization requests provided by you are
        used as supplied. Please double-check measurements and notes at checkout — once production begins on a
        customized piece, changes may not be possible.
      </p>

      <h2>5. Shipping & Dispatch</h2>
      <p>
        Dispatch windows shown against each product are estimates and may vary for handcrafted and made-to-order
        items. We will keep you informed of your order status, which you can also check via the order tracking page
        or, if registered, your account&rsquo;s order history.
      </p>

      <h2>6. Refunds & Returns</h2>
      <p>
        Please review our <a className="text-crimson underline" href="/refund-policy">Refund Policy</a> before
        purchasing — all sales are final.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All designs, photography, text and branding on this site are the property of Trinetra By Rajababu and may
        not be reproduced without written permission.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        We are not liable for indirect or consequential loss arising from use of this site or delays caused by
        circumstances beyond our reasonable control, including courier delays.
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>We may update these Terms from time to time. Continued use of the site after changes constitutes acceptance of the revised Terms.</p>

      <h2>10. Contact</h2>
      <p>
        For any questions about these Terms, write to us at{" "}
        <a className="text-crimson underline" href="mailto:hello@trinetra.in">hello@trinetra.in</a>.
      </p>
    </LegalLayout>
  );
}
