"use client";

import { FormEvent, useState } from "react";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  updateProfile,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isPasswordValid } from "@/lib/password";
import PasswordStrengthChecklist from "./PasswordStrengthChecklist";

type Tab = "google" | "email" | "phone";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.41 3.62v3.01h3.86c2.26-2.08 3.6-5.16 3.6-8.66z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.92-2.92l-3.86-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.22 21.3 7.27 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.26c-.24-.72-.38-1.49-.38-2.26s.14-1.54.38-2.26V6.63H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.37l4-3.11z" />
      <path fill="#EA4335" d="M12 4.78c1.76 0 3.34.61 4.58 1.79l3.43-3.43C17.94 1.18 15.24 0 12 0 7.27 0 3.22 2.7 1.27 6.63l4 3.11C6.22 6.89 8.87 4.78 12 4.78z" />
    </svg>
  );
}

function TabIcon({ tab }: { tab: Tab }) {
  if (tab === "google") return <GoogleGlyph />;
  if (tab === "email")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
        <path d="M3.5 6.5l8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" strokeLinecap="round" />
    </svg>
  );
}

export default function AccountAuthPanel({
  onSignedIn,
  header,
}: {
  onSignedIn: () => void;
  header?: React.ReactNode;
}) {
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

  async function registerProfile(idToken: string, params: { name?: string; phone?: string; isNewUser: boolean }) {
    try {
      await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, ...params }),
      });
    } catch (error) {
      console.error("Failed to sync account profile", error);
    }
  }

  async function handleGoogle() {
    setPending(true);
    setError("");
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const isNewUser = Boolean(getAdditionalUserInfo(credential)?.isNewUser);
      const idToken = await credential.user.getIdToken();
      await registerProfile(idToken, { isNewUser });
      await establishSession(idToken);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative border border-gold/20 bg-warm-white shadow-[0_20px_60px_-20px_rgba(30,22,16,0.35)]">
      <div className="h-1 w-full bg-gradient-to-r from-crimson via-gold to-crimson" />

      <div className="p-6 sm:p-8">
        {header && <div className="mb-7">{header}</div>}

        <div className="mb-7 grid grid-cols-3 gap-2">
          {(["google", "email", "phone"] as Tab[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setTab(option);
                setError("");
              }}
              className={`flex items-center justify-center gap-2 border py-3 text-[10px] uppercase tracking-[0.2em] transition ${
                tab === option ? "border-crimson bg-crimson/5 text-crimson" : "border-gold/15 text-taupe hover:border-gold/40"
              }`}
            >
              <TabIcon tab={option} />
              {option === "google" ? "Google" : option === "email" ? "Email" : "Phone"}
            </button>
          ))}
        </div>

        {tab === "google" && (
          <div>
            <p className="mb-5 text-center text-sm text-taupe">Continue with your Google account for instant, secure access.</p>
            <button
              type="button"
              disabled={pending}
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-3 border border-gold/30 bg-warm-white py-3.5 text-sm font-medium text-charcoal transition hover:border-gold disabled:opacity-50"
            >
              <GoogleGlyph />
              {pending ? "Signing In…" : "Continue With Google"}
            </button>
          </div>
        )}

        {tab === "email" && <EmailAuthForm onIdToken={establishSession} onRegister={registerProfile} setError={setError} />}
        {tab === "phone" && <PhoneAuthForm onIdToken={establishSession} onRegister={registerProfile} setError={setError} />}

        {error && <p className="mt-4 text-center text-sm text-crimson">{error}</p>}
      </div>
    </div>
  );
}

type RegisterFn = (idToken: string, params: { name?: string; phone?: string; isNewUser: boolean }) => Promise<void>;

function EmailAuthForm({
  onIdToken,
  onRegister,
  setError,
}: {
  onIdToken: (idToken: string) => Promise<void>;
  onRegister: RegisterFn;
  setError: (message: string) => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const canSubmitSignup = mode === "signup" ? isPasswordValid(password) && passwordsMatch && confirmPassword.length > 0 : true;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");

    try {
      if (mode === "signup") {
        const name = String(form.get("name") ?? "");
        const phone = String(form.get("phone") ?? "");

        if (!isPasswordValid(password)) {
          setError("Password does not meet all the requirements below.");
          return;
        }
        if (!passwordsMatch) {
          setError("Passwords do not match.");
          return;
        }

        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        await sendEmailVerification(credential.user);
        setNotice("Account created. We've also sent a verification link to your email.");
        const idToken = await credential.user.getIdToken();
        await onRegister(idToken, { name, phone, isNewUser: true });
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
      {mode === "signup" && (
        <>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Full Name</span>
            <input required name="name" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Phone Number</span>
            <input required name="phone" placeholder="+919999999999" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
          </label>
        </>
      )}

      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Email</span>
        <input required type="email" name="email" className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson" />
      </label>

      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Password</span>
        <input
          required
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
        />
        {mode === "signup" && <PasswordStrengthChecklist password={password} />}
      </label>

      {mode === "signup" && (
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Confirm Password</span>
          <input
            required
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onBlur={() => setConfirmTouched(true)}
            className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 outline-none focus:border-crimson"
          />
          {confirmTouched && confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-1.5 text-[11px] text-crimson">Passwords do not match.</p>
          )}
        </label>
      )}

      <button disabled={pending || !canSubmitSignup} type="submit" className="btn-gold w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed">
        {pending ? "Please Wait" : mode === "signup" ? "Create Account" : "Sign In"}
      </button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setError("");
          setNotice("");
        }}
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
  onRegister,
  setError,
}: {
  onIdToken: (idToken: string) => Promise<void>;
  onRegister: RegisterFn;
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
      const isNewUser = Boolean(getAdditionalUserInfo(credential)?.isNewUser);
      const idToken = await credential.user.getIdToken();
      await onRegister(idToken, { phone, isNewUser });
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
