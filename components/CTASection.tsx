"use client";

import { useEffect, useRef } from "react";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 linen-bg overflow-hidden"
    >
      <div className="absolute inset-0 bg-ivory/80 pointer-events-none" />

      {/* Decorative background circle */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none"
        viewBox="0 0 500 500"
        style={{ width: "60vw", maxWidth: "600px" }}
      >
        <circle cx="250" cy="250" r="240" fill="none" stroke="#8B1A1A" strokeWidth="1" strokeDasharray="6 4" />
        <circle cx="250" cy="250" r="200" fill="none" stroke="#C9922A" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx="250" cy="250" r="160" fill="none" stroke="#8B1A1A" strokeWidth="0.5" />
      </svg>

      <div className="relative max-w-4xl mx-auto px-6 text-center">

        <div className="reveal">
          <p className="eyebrow-stitch mb-6">Begin Your Journey</p>

          {/* Stitched heading */}
          <svg
            className="w-full max-w-2xl mx-auto mb-4"
            viewBox="0 0 660 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="80%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="60"
              fontWeight="700"
              letterSpacing="8"
              fill="rgba(139,26,26,0.06)"
            >
              VISIT OUR
            </text>
            <text
              x="50%"
              y="80%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="60"
              fontWeight="700"
              letterSpacing="8"
              fill="none"
              stroke="#8B1A1A"
              strokeWidth="1.3"
              strokeDasharray="5 2.5"
              strokeLinecap="round"
            >
              VISIT OUR
            </text>
          </svg>

          <svg
            className="w-full max-w-xl mx-auto mb-8"
            viewBox="0 0 560 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="80%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="54"
              fontWeight="700"
              letterSpacing="8"
              fill="rgba(201,146,42,0.06)"
            >
              ATELIER
            </text>
            <text
              x="50%"
              y="80%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="54"
              fontWeight="700"
              letterSpacing="8"
              className="stitch-static-crimson"
            >
              ATELIER
            </text>
          </svg>

          <p
            className="text-taupe max-w-xl mx-auto leading-loose mb-10"
            style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem" }}
          >
            Visit our showroom to experience the magic of Trinetra By Rajababu firsthand.
            Walk through curated collections, feel the fabrics and consult with our designers
            — or book a private appointment for an exclusive, personalised session.
          </p>

          {/* Store info */}
          <div className="grid sm:grid-cols-3 gap-8 mb-12 text-left max-w-2xl mx-auto">
            {[
              {
                icon: (
                  <svg viewBox="0 0 20 20" className="w-4 h-4">
                    <circle cx="10" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M10 12 L10 19 M6 16 Q10 20 14 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ),
                label: "Our Atelier",
                value: ["Rajababu Showroom,", "Heritage Lane, City Centre"],
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" className="w-4 h-4">
                    <path d="M4 4 L8 4 L10 9 L7 11 C9 15 11 17 15 19 L17 16 L20 18 L20 16 C20 10 14 4 4 4Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                label: "Call Us",
                value: ["+91 98765 43210", "Mon–Sat · 10am–8pm"],
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" className="w-4 h-4">
                    <rect x="2" y="4" width="16" height="13" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M2 7 L10 13 L18 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ),
                label: "Email",
                value: ["hello@trinetra.in", "We reply within 2 hours"],
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="mt-1 text-gold flex-shrink-0"
                  style={{ color: "var(--gold)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p
                    className="text-charcoal text-[9px] tracking-[0.35em] uppercase mb-1"
                    style={{ fontFamily: "var(--font-jost), sans-serif" }}
                  >
                    {item.label}
                  </p>
                  {item.value.map((v, j) => (
                    <p
                      key={j}
                      className="text-taupe text-[13px]"
                      style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "0.95rem" }}
                    >
                      {v}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="tel:+919876543210"
              className="btn-gold"
              style={{ background: "linear-gradient(135deg, #8B1A1A, #C9922A)" }}
            >
              Book Appointment
            </a>
            <a
              href="https://www.instagram.com/trinetrabyrajababu"
              className="btn-outline-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram · @trinetrabyrajababu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
