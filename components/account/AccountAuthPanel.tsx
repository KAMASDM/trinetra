"use client";

import { FormEvent, useState } from "react";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type Tab = "google" | "email" | "phone";

export default function AccountAuthPanel({ onSignedIn }: { onSignedIn: () => void }) {
  const [tab, setTab] = useState<Tab>("google");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function establishSession(idToken: string) {
    const response = await fetch("/api/auth/customer-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!response.ok) throw new Error("Could not start session");
    onSignedIn();
  }

  async function handleGoogle() {
    setPending(true);
    setError("");
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();
      await establishSession(idToken);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border border-gold/25 bg-warm-white/90 p-6">
      <div className="mb-6 flex gap-2 border-b border-gold/15">
        {(["google", "email", "phone"] as Tab[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setTab(option);
              setError("");
            }}
            className={`px-4 py-3 text-[11px] uppercase tracking-[0.25em] transition ${
              tab === option ? "border-b-2 border-crimson text-crimson" : "text-taupe"
            }`}
          >
            {option === "google" ? "Google" : option === "email" ? "Email" : "Phone"}
          </button>
        ))}
      </div>

      {tab === "google" && (
        <button type="button" disabled={pending} onClick={handleGoogle} className="btn-gold w-full justify-center">
          {pending ? "Signing In" : "Continue With Google"}
        </button>
      )}

      {tab === "email" && <EmailAuthForm onIdToken={establishSession} setError={setError} />}
      {tab === "phone" && <PhoneAuthForm onIdToken={establishSession} setError={setError} />}

      {error && <p className="mt-4 text-sm text-crimson">{error}</p>}
    </div>
  );
}

function EmailAuthForm({
  onIdToken,
  setError,
}: {
  onIdToken: (idToken: string) => Promise<void>;
  setError: (message: string) => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(credential.user);
        setNotice("Account created. We've sent a verification link to your email.");
        const idToken = await credential.user.getIdToken();
        await onIdToken(idToken);
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await credential.user.getIdToken();
        await onIdToken(idToken);
      }
    } catch {
      setError(mode === "signup" ? "Could not create account. Try a different email." : "Incorrect email or password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Email</span>
        <input required type="email" name="email" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
      </label>
      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Password</span>
        <input required type="password" name="password" minLength={6} className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
      </label>
      <button disabled={pending} type="submit" className="btn-gold w-full justify-center">
        {pending ? "Please Wait" : mode === "signup" ? "Create Account" : "Sign In"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        className="w-full text-center text-[11px] uppercase tracking-[0.25em] text-taupe hover:text-crimson"
      >
        {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>
      {notice && <p className="text-sm text-taupe">{notice}</p>}
    </form>
  );
}

function PhoneAuthForm({
  onIdToken,
  setError,
}: {
  onIdToken: (idToken: string) => Promise<void>;
  setError: (message: string) => void;
}) {
  const [phone, setPhone] = useState("+91");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [pending, setPending] = useState(false);

  async function sendCode() {
    setPending(true);
    setError("");
    try {
      const verifier = new RecaptchaVerifier(auth, "phone-recaptcha-container", { size: "invisible" });
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(result);
    } catch {
      setError("Could not send code. Check the phone number and try again.");
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
      await onIdToken(idToken);
    } catch {
      setError("Incorrect code. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Phone Number</span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+919999999999"
          className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
        />
      </label>
      {!confirmation ? (
        <button type="button" disabled={pending} onClick={sendCode} className="btn-gold w-full justify-center">
          {pending ? "Sending" : "Send Code"}
        </button>
      ) : (
        <>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Enter Code</span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
            />
          </label>
          <button type="button" disabled={pending} onClick={verifyCode} className="btn-gold w-full justify-center">
            {pending ? "Verifying" : "Verify & Continue"}
          </button>
        </>
      )}
      <div id="phone-recaptcha-container" />
    </div>
  );
}
