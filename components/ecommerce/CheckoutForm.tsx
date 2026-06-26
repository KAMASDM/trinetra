"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { formatPrice } from "@/lib/products";
import AccountAuthPanel from "@/components/account/AccountAuthPanel";
import { useCart } from "./CartContext";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutForm() {
  const cart = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "creating" | "paying" | "verifying" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [checkoutMode, setCheckoutMode] = useState<"choose" | "register" | "guest">("choose");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneIdToken, setPhoneIdToken] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (current) => {
      setUser(current);
      if (current) {
        setEmail(current.email ?? "");
        setPhone(current.phoneNumber ?? "");
      }
    });
  }, []);

  const isRegistered = Boolean(user);
  const guestVerified = emailVerified && phoneVerified;
  const canPay = agreedToTerms && (isRegistered || guestVerified);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.items.length || !canPay) return;

    setStatus("creating");
    setErrorMessage("");

    const form = new FormData(event.currentTarget);
    const customer = {
      name: String(form.get("name") ?? ""),
      email,
      phone,
      city: String(form.get("city") ?? ""),
      address: String(form.get("address") ?? ""),
    };
    const notes = String(form.get("notes") ?? "");

    try {
      const customerIdToken = isRegistered ? await user!.getIdToken() : undefined;

      const createResponse = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          notes,
          agreedToTerms,
          customerIdToken,
          phoneIdToken: isRegistered ? undefined : phoneIdToken,
          items: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }),
      });

      const created = await createResponse.json();
      if (!createResponse.ok) throw new Error(created.error ?? "Could not create order");

      setStatus("paying");

      const razorpay = new window.Razorpay({
        key: created.keyId,
        order_id: created.razorpayOrderId,
        amount: created.amount,
        currency: created.currency,
        name: "Trinetra By Rajababu",
        description: "Heritage Couture Order",
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: "#8B1A1A" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          setStatus("verifying");
          try {
            const verifyResponse = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: created.orderId,
                razorpayOrderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) throw new Error("Payment verification failed");

            cart.clearCart();
            router.push(`/order-confirmation/${created.orderId}`);
          } catch (error) {
            console.error(error);
            setStatus("error");
            setErrorMessage("Payment verification failed. If money was deducted, contact us with your order id.");
          }
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <section className="min-h-screen linen-bg pt-28 pb-16">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <p className="eyebrow-stitch mb-5">Checkout</p>

        {!isRegistered && checkoutMode === "choose" && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 max-w-2xl">
            <button type="button" onClick={() => setCheckoutMode("register")} className="border border-gold/25 bg-warm-white/80 p-6 text-left hover:border-crimson">
              <p className="font-cinzel text-lg text-charcoal">Sign In / Register</p>
              <p className="mt-2 text-sm text-taupe">Track every order in one place. Sign in with Google, email or phone.</p>
            </button>
            <button type="button" onClick={() => setCheckoutMode("guest")} className="border border-gold/25 bg-warm-white/80 p-6 text-left hover:border-crimson">
              <p className="font-cinzel text-lg text-charcoal">Continue As Guest</p>
              <p className="mt-2 text-sm text-taupe">Quick checkout — we&rsquo;ll just verify your email and phone with a code.</p>
            </button>
          </div>
        )}

        {!isRegistered && checkoutMode === "register" && (
          <div className="mb-8 max-w-md">
            <AccountAuthPanel onSignedIn={() => {}} />
            <button type="button" onClick={() => setCheckoutMode("choose")} className="mt-4 text-[11px] uppercase tracking-[0.25em] text-taupe hover:text-crimson">
              ← Back
            </button>
          </div>
        )}

        {(isRegistered || checkoutMode === "guest") && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <form onSubmit={handleSubmit} className="border border-gold/20 bg-warm-white/80 p-6">
              <h1 className="font-cinzel text-3xl text-charcoal">Delivery & Consultation Details</h1>

              {isRegistered && (
                <p className="mt-4 text-sm text-taupe">
                  Signed in as <span className="text-crimson">{user?.email ?? user?.phoneNumber}</span>.
                </p>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Full name</span>
                  <input required name="name" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
                </label>

                <EmailField
                  email={email}
                  onEmailChange={(value) => {
                    setEmail(value);
                    setEmailVerified(false);
                  }}
                  verified={isRegistered || emailVerified}
                  showVerification={!isRegistered}
                  onVerified={() => setEmailVerified(true)}
                />

                <PhoneField
                  phone={phone}
                  onPhoneChange={(value) => {
                    setPhone(value);
                    setPhoneVerified(false);
                    setPhoneIdToken(null);
                  }}
                  verified={isRegistered || phoneVerified}
                  showVerification={!isRegistered}
                  onVerified={(idToken) => {
                    setPhoneVerified(true);
                    setPhoneIdToken(idToken);
                  }}
                />

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">City</span>
                  <input required name="city" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Address</span>
                <textarea required name="address" rows={3} className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
              </label>
              <label className="mt-4 block">
                <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Measurements, custom notes or occasion date</span>
                <textarea name="notes" rows={4} className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
              </label>

              <label className="mt-5 flex items-start gap-3 text-sm text-taupe">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-crimson"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="text-crimson underline">Terms & Conditions</Link>,{" "}
                  <Link href="/privacy" target="_blank" className="text-crimson underline">Privacy Policy</Link> and{" "}
                  <Link href="/refund-policy" target="_blank" className="text-crimson underline">Refund Policy</Link>.
                </span>
              </label>

              <button
                disabled={!cart.items.length || !canPay || status === "creating" || status === "paying" || status === "verifying"}
                type="submit"
                className="btn-gold mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "creating" && "Preparing Payment"}
                {status === "paying" && "Awaiting Payment"}
                {status === "verifying" && "Confirming Order"}
                {(status === "idle" || status === "error") && "Pay & Place Order"}
              </button>
              {status === "error" && <p className="mt-4 text-sm text-crimson">{errorMessage}</p>}
            </form>

            <aside className="h-fit border border-gold/25 bg-charcoal p-6 text-warm-white">
              <p className="font-cinzel text-2xl text-gold">Summary</p>
              <div className="divider-dash my-5" />
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3 text-sm">
                    <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <p className="text-warm-white/80">{item.product.name}</p>
                      <p className="text-warm-white/40">{item.quantity} x {formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider-dash my-5" />
              <div className="flex justify-between font-cinzel text-xl text-gold">
                <span>Total</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
            </aside>
          </div>
        )}
      </div>
      {!cart.items.length && status === "idle" && (
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <Link href="/shop" className="btn-outline-gold">Your cart is empty — Browse the shop</Link>
        </div>
      )}
    </section>
  );
}

function EmailField({
  email,
  onEmailChange,
  verified,
  showVerification,
  onVerified,
}: {
  email: string;
  onEmailChange: (value: string) => void;
  verified: boolean;
  showVerification: boolean;
  onVerified: () => void;
}) {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function sendCode() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/otp/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error();
      setCodeSent(true);
    } catch {
      setError("Could not send code. Check the email address.");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/otp/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!response.ok) throw new Error();
      onVerified();
    } catch {
      setError("Incorrect or expired code.");
    } finally {
      setPending(false);
    }
  }

  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">
        Email {verified && <span className="text-crimson">(Verified)</span>}
      </span>
      <input
        required
        type="email"
        value={email}
        disabled={verified && !showVerification}
        onChange={(event) => onEmailChange(event.target.value)}
        className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
      />
      {showVerification && !verified && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {!codeSent ? (
            <button type="button" disabled={pending || !email} onClick={sendCode} className="text-[10px] uppercase tracking-[0.25em] text-crimson underline">
              {pending ? "Sending" : "Send Code"}
            </button>
          ) : (
            <>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="6-digit code"
                className="w-32 border border-gold/25 bg-ivory px-2 py-2 text-sm outline-none focus:border-crimson"
              />
              <button type="button" disabled={pending} onClick={verifyCode} className="text-[10px] uppercase tracking-[0.25em] text-crimson underline">
                Verify
              </button>
            </>
          )}
          {error && <span className="text-xs text-crimson">{error}</span>}
        </div>
      )}
    </label>
  );
}

function PhoneField({
  phone,
  onPhoneChange,
  verified,
  showVerification,
  onVerified,
}: {
  phone: string;
  onPhoneChange: (value: string) => void;
  verified: boolean;
  showVerification: boolean;
  onVerified: (idToken: string) => void;
}) {
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function sendCode() {
    setPending(true);
    setError("");
    try {
      const verifier = new RecaptchaVerifier(auth, "checkout-phone-recaptcha", { size: "invisible" });
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(result);
    } catch {
      setError("Could not send code. Check the phone number.");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode() {
    if (!confirmation) return;
    setPending(true);
    setError("");
    try {
      const credential = await confirmation.confirm(code);
      const idToken = await credential.user.getIdToken();
      await signOut(auth); // verification only — don't leave the guest signed in
      onVerified(idToken);
    } catch {
      setError("Incorrect code.");
    } finally {
      setPending(false);
    }
  }

  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">
        Phone {verified && <span className="text-crimson">(Verified)</span>}
      </span>
      <input
        required
        value={phone}
        disabled={verified && !showVerification}
        onChange={(event) => onPhoneChange(event.target.value)}
        placeholder="+919999999999"
        className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
      />
      {showVerification && !verified && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {!confirmation ? (
            <button type="button" disabled={pending || !phone} onClick={sendCode} className="text-[10px] uppercase tracking-[0.25em] text-crimson underline">
              {pending ? "Sending" : "Send Code"}
            </button>
          ) : (
            <>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="6-digit code"
                className="w-32 border border-gold/25 bg-ivory px-2 py-2 text-sm outline-none focus:border-crimson"
              />
              <button type="button" disabled={pending} onClick={verifyCode} className="text-[10px] uppercase tracking-[0.25em] text-crimson underline">
                Verify
              </button>
            </>
          )}
          {error && <span className="text-xs text-crimson">{error}</span>}
        </div>
      )}
      <div id="checkout-phone-recaptcha" />
    </label>
  );
}
