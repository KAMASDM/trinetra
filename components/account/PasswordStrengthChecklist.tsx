"use client";

import { passwordRules } from "@/lib/password";

export default function PasswordStrengthChecklist({ password }: { password: string }) {
  return (
    <ul className="mt-2 grid gap-1.5">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <li key={rule.id} className="flex items-center gap-2 text-[11px] transition-colors">
            <span
              className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border text-[9px] transition-colors ${
                met ? "border-green-600 bg-green-600 text-white" : "border-taupe/40 text-transparent"
              }`}
            >
              ✓
            </span>
            <span className={met ? "text-green-700" : "text-taupe"}>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
