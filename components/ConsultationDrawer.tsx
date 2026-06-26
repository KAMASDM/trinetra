"use client";

import { useConsultation } from "./ConsultationContext";
import ConsultationForm from "./ConsultationForm";

export default function ConsultationDrawer() {
  const { isOpen, close } = useConsultation();

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-charcoal/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-gold/25 bg-ivory transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gold/20 bg-warm-white p-5">
            <div>
              <p className="eyebrow-stitch text-[10px]" style={{ color: "var(--crimson)" }}>Begin Your Journey</p>
              <p className="mt-1 font-cinzel text-lg text-charcoal">Book A Consultation</p>
            </div>
            <button onClick={close} aria-label="Close" className="text-taupe hover:text-crimson text-xl">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <p className="mb-5 text-sm text-taupe">
              Tell us what you&rsquo;re looking for and our design team will reach out to schedule your personal
              consultation.
            </p>
            <ConsultationForm />
          </div>
        </div>
      </aside>
    </>
  );
}
