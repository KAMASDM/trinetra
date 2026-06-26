"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Design Consultation",
    desc: "Our master designers sit with you and translate your vision into sketches, colour palettes and fabric suggestions — crafting a bespoke blueprint just for you.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <path d="M8 32 L8 16 L20 4 L32 16 L32 32 Z" fill="none" stroke="#E6B400" strokeWidth="1.5" strokeDasharray="3 1.5" strokeLinecap="round" />
        <circle cx="20" cy="14" r="4" fill="none" stroke="#E6B400" strokeWidth="1" />
        <path d="M14 32 L14 24 L26 24 L26 32" fill="none" stroke="#E6B400" strokeWidth="1" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Fabric Selection",
    desc: "Curated from the finest mills of Varanasi, Kanchipuram and Chandigarh — every fabric is hand-selected for texture, drape and dye-fastness.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <path d="M4 20 Q20 4 36 20 Q20 36 4 20Z" fill="none" stroke="#E6B400" strokeWidth="1.5" strokeDasharray="3 1.5" strokeLinecap="round" />
        <path d="M4 20 Q20 12 36 20" fill="none" stroke="#E6B400" strokeWidth="0.8" strokeDasharray="2 1" />
        <circle cx="20" cy="20" r="3" fill="#E6B400" opacity="0.5" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Master Tailoring",
    desc: "Each garment passes through 6–12 specialist craftsmen. Hand embroiderers, zardozi artists and cutwork specialists work in concert for weeks.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        {/* Needle and thread */}
        <path d="M8 8 L30 30" fill="none" stroke="#E6B400" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 1.5" />
        <circle cx="8" cy="8" r="3" fill="none" stroke="#E6B400" strokeWidth="1" />
        <path d="M7 7 L9 9" fill="none" stroke="#E6B400" strokeWidth="0.8" />
        <path d="M32 32 Q38 26 34 20 Q40 22 36 30Z" fill="#E6B400" opacity="0.5" />
        {/* Thread loops */}
        <path d="M14 18 Q18 12 22 16 Q18 20 14 18Z" fill="none" stroke="#E6B400" strokeWidth="0.7" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Final Fitting",
    desc: "Three rounds of fitting sessions ensure the garment sits flawlessly on your silhouette. We alter until perfection — because every inch matters.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <path d="M10 6 L30 6 L32 16 L28 16 L28 36 L12 36 L12 16 L8 16 Z" fill="none" stroke="#E6B400" strokeWidth="1.5" strokeDasharray="3 1.5" strokeLinecap="round" />
        <path d="M14 20 L26 20 M14 25 L26 25 M14 30 L22 30" fill="none" stroke="#E6B400" strokeWidth="0.8" opacity="0.5" />
        {/* Check mark */}
        <path d="M16 12 L19 15 L24 9" fill="none" stroke="#F7D154" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function CraftsmanshipSection() {
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
      id="craftsmanship"
      ref={sectionRef}
      className="relative py-16 sm:py-24 linen-bg"
    >
      <div className="absolute inset-0 bg-ivory/75 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="eyebrow-stitch mb-4" style={{ color: "var(--crimson)" }}>How We Create</p>

          <svg
            className="w-full max-w-3xl mx-auto mb-2"
            viewBox="0 0 1050 90"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="80%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="58"
              fontWeight="700"
              letterSpacing="10"
              fill="rgba(139,26,26,0.06)"
            >
              THE ART OF CREATION
            </text>
            <text
              x="50%"
              y="80%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="58"
              fontWeight="700"
              letterSpacing="10"
              className="stitch-static-crimson"
            >
              THE ART OF CREATION
            </text>
          </svg>

          <div className="divider-dash max-w-xs mx-auto mt-4" />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal relative group"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Connector line (except last) */}
              {i < steps.length - 1 && (
                <div
                  className="absolute top-8 left-full w-8 h-px hidden lg:block z-10"
                  style={{
                    background: "repeating-linear-gradient(90deg, #E6B400 0px, #E6B400 4px, transparent 4px, transparent 8px)",
                    opacity: 0.4,
                  }}
                />
              )}

              {/* Card */}
              <div
                className="relative p-8 h-full transition-all duration-500 group-hover:-translate-y-2"
                style={{
                  background: "rgba(30,22,16,0.9)",
                  border: "1px solid rgba(201,146,42,0.25)",
                  outline: "1px solid rgba(201,146,42,0.1)",
                  outlineOffset: "4px",
                  backdropFilter: "blur(4px)",
                }}
              >
                {/* Step number — stitched */}
                <svg
                  className="mb-5 w-14 h-12"
                  viewBox="0 0 56 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <text
                    x="0"
                    y="85%"
                    fontFamily="Cinzel, serif"
                    fontSize="38"
                    fontWeight="700"
                    fill="rgba(201,146,42,0.04)"
                  >
                    {step.num}
                  </text>
                  <text
                    x="0"
                    y="85%"
                    fontFamily="Cinzel, serif"
                    fontSize="38"
                    fontWeight="700"
                    fill="none"
                    stroke="#E6B400"
                    strokeWidth="0.9"
                    strokeDasharray="4 2"
                    strokeLinecap="round"
                    opacity="0.7"
                  >
                    {step.num}
                  </text>
                </svg>

                {/* Icon */}
                <div className="mb-5 p-3 inline-block rounded-full"
                  style={{ background: "rgba(201,146,42,0.08)" }}>
                  {step.icon}
                </div>

                {/* Title */}
                <h3
                  className="heading-stitched text-sm mb-4"
                  style={{ fontSize: "0.82rem", letterSpacing: "0.15em" }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-warm-white/65 leading-relaxed text-sm"
                  style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1rem" }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Blouse craftsmanship gallery */}
        <div className="mt-20 reveal">
          <p
            className="text-center eyebrow-stitch mb-8"
            style={{ color: "#8B1A1A", opacity: 0.7, fontSize: "0.65rem" }}
          >
            Our Masterwork
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { src: "/brocade-blouse-front.jpg", label: "Brocade Front" },
              { src: "/open-back-blouse.jpg", label: "Open Back Detail" },
              { src: "/black-brocade-blouse.jpg", label: "Midnight Brocade" },
              { src: "/black-blouse-back.jpg", label: "Back Embroidery" },
            ].map((item, i) => (
              <div
                key={i}
                className="relative overflow-hidden group"
                style={{
                  border: "1px solid rgba(201,146,42,0.2)",
                  outline: "1px solid rgba(201,146,42,0.07)",
                  outlineOffset: "3px",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  width={320}
                  height={220}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 320px"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                    transition: "transform 0.6s ease",
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 py-2 px-3"
                  style={{ background: "rgba(30,22,16,0.75)" }}
                >
                  <p
                    className="text-center tracking-widest uppercase"
                    style={{
                      color: "rgba(201,146,42,0.9)",
                      fontFamily: "var(--font-jost), sans-serif",
                      fontSize: "0.58rem",
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom promise strip */}
        <div
          className="mt-20 reveal grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(201,146,42,0.07) 0%, rgba(228,184,74,0.05) 100%)",
            border: "1px solid rgba(201,146,42,0.2)",
          }}
        >
          {[
            { icon: "✦", title: "Handcrafted", sub: "Every stitch by hand" },
            { icon: "✦", title: "Heritage Fabrics", sub: "Sourced from master weavers" },
            { icon: "✦", title: "Made-to-measure", sub: "Fits only you" },
            { icon: "✦", title: "Quality Assured", sub: "6-point quality check" },
          ].map((p, i) => (
            <div key={i}>
              <span className="text-gold text-lg block mb-2">{p.icon}</span>
              <p
                className="text-charcoal font-semibold tracking-widest text-xs uppercase mb-1"
                style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.7rem" }}
              >
                {p.title}
              </p>
              <p
                className="text-taupe text-xs"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {p.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
