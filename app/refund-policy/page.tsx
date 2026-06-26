import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = { title: "Refund Policy | Trinetra By Rajababu" };

export default function RefundPolicyPage() {
  return (
    <LegalLayout eyebrow="Legal" title="Refund Policy" updatedAt={new Date().toLocaleDateString("en-IN")}>
      <p>
        <strong>All sales on Trinetra By Rajababu are final. We do not offer refunds, cancellations, or returns
        on any order, for any reason, once payment has been confirmed.</strong>
      </p>

      <h2>Why We Don&rsquo;t Offer Refunds</h2>
      <p>
        Many of our pieces are made-to-measure, made-to-order, or hand-finished by artisans specifically for your
        order. Production begins shortly after your payment is confirmed, which means costs are incurred
        immediately and the piece cannot be resold once work has started.
      </p>

      <h2>Before You Order</h2>
      <p>
        Please review product details, fabric, sizing, colour and customization notes carefully before completing
        payment. If you have any questions about fit, fabric or customization, contact us at{" "}
        <a className="text-crimson underline" href="mailto:reachout@trinetrastudio.in">reachout@trinetrastudio.in</a> before placing
        your order — our team is happy to help you choose correctly.
      </p>

      <h2>Order Cancellations</h2>
      <p>Orders cannot be cancelled once payment has been confirmed and production has commenced.</p>

      <h2>Damaged or Incorrect Items</h2>
      <p>
        If your order arrives damaged in transit or does not match what you ordered, please contact us within 48
        hours of delivery at{" "}
        <a className="text-crimson underline" href="mailto:reachout@trinetrastudio.in">reachout@trinetrastudio.in</a> with photos
        and your order ID, and we will review it on a case-by-case basis.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to{" "}
        <a className="text-crimson underline" href="mailto:reachout@trinetrastudio.in">reachout@trinetrastudio.in</a>.
      </p>
    </LegalLayout>
  );
}
