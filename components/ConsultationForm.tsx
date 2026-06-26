"use client";

import { FormEvent, useState } from "react";
import { consultationTypes } from "@/lib/consultation";

export default function ConsultationForm() {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [otpPending, setOtpPending] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function sendCode() {
    setOtpPending(true);
    setOtpError("");
    try {
      const response = await fetch("/api/otp/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error();
      setCodeSent(true);
    } catch {
      setOtpError("Could not send code. Check the email address.");
    } finally {
      setOtpPending(false);
    }
  }

  async function verifyCode() {
    setOtpPending(true);
    setOtpError("");
    try {
      const response = await fetch("/api/otp/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!response.ok) throw new Error();
      setEmailVerified(true);
    } catch {
      setOtpError("Incorrect or expired code.");
    } finally {
      setOtpPending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!emailVerified) return;

    setStatus("submitting");
    setError("");

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/consultation/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email,
          phone: form.get("phone"),
          consultationType: form.get("consultationType"),
          notes: form.get("notes"),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not send your request");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-gold/20 bg-warm-white p-6 text-center">
        <p className="font-cinzel text-xl text-crimson mb-3">Request Received</p>
        <p className="text-taupe text-sm">
          Thank you — we&rsquo;ve emailed you a confirmation and our team will reach out within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gold/20 bg-warm-white p-5 space-y-5">
      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Full Name</span>
        <input required name="name" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
      </label>

      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">
          Email {emailVerified && <span className="text-crimson">(Verified)</span>}
        </span>
        <input
          required
          type="email"
          value={email}
          disabled={emailVerified}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailVerified(false);
            setCodeSent(false);
          }}
          className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson disabled:opacity-60"
        />
        {!emailVerified && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {!codeSent ? (
              <button type="button" disabled={otpPending || !email} onClick={sendCode} className="text-[10px] uppercase tracking-[0.25em] text-crimson underline">
                {otpPending ? "Sending" : "Send Code"}
              </button>
            ) : (
              <>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="6-digit code"
                  className="w-32 border border-gold/25 bg-ivory px-2 py-2 text-sm outline-none focus:border-crimson"
                />
                <button type="button" disabled={otpPending} onClick={verifyCode} className="text-[10px] uppercase tracking-[0.25em] text-crimson underline">
                  Verify
                </button>
              </>
            )}
            {otpError && <span className="text-xs text-crimson">{otpError}</span>}
          </div>
        )}
      </label>

      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Phone Number</span>
        <input required name="phone" placeholder="+919999999999" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
      </label>

      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Type Of Consultation</span>
        <select required name="consultationType" defaultValue="" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson">
          <option value="" disabled>Select one</option>
          {consultationTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Additional Notes</span>
        <textarea name="notes" rows={4} placeholder="Occasion date, measurements, styling preferences..." className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
      </label>

      <button
        type="submit"
        disabled={!emailVerified || status === "submitting"}
        className="btn-gold w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending Request" : "Book Consultation"}
      </button>
      {status === "error" && <p className="text-sm text-crimson">{error}</p>}
    </form>
  );
}
