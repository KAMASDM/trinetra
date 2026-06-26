"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const bridalHighlights = [
  {
    title: "Bridal Lehenga",
    desc: "Opulent zardozi & real gold-thread embroidery on Katan silk. Made-to-measure over 3–4 weeks with 12 master artisans.",
    icon: "✦",
    category: "Bridal Lehengas",
  },
  {
    title: "Wedding Saree",
    desc: "Kanchi & Banarasi silks with hand-woven gold border. Every saree takes 20–90 days on the handloom.",
    icon: "✦",
    category: "Heritage Sarees",
  },
  {
    title: "Bridal Blouse",
    desc: "Custom-crafted, heavily embellished blouses with patch-work, mirror-work and Swarovski detailing.",
    icon: "✦",
    category: "Bridal Blouses",
  },
];

export default function BridalSection() {
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
      id="bridal"
      ref={sectionRef}
      className="relative py-20 sm:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #5C0E0E 0%, #3A0808 40%, #1E1610 100%)",
      }}
    >
      {/* Linen overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "url('/linen-bg.avif')",
          backgroundRepeat: "repeat",
          backgroundSize: "320px 320px",
        }}
      />

      {/* Top diagonal decorative band */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #E6B400, #F7D154, #E6B400, transparent)" }}
      />

      {/* Scattered gold petals */}
      {[
        { x: "5%",  y: "20%", size: 40, opacity: 0.08 },
        { x: "92%", y: "18%", size: 35, opacity: 0.08 },
        { x: "8%",  y: "75%", size: 30, opacity: 0.06 },
        { x: "88%", y: "72%", size: 45, opacity: 0.06 },
      ].map((p, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, opacity: p.opacity }}
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <g key={a} transform={`rotate(${a} 25 25)`}>
              <path d="M25 5 C29 15 40 15 40 25 C40 15 51 15 25 5Z" fill="#E6B400" />
            </g>
          ))}
        </svg>
      ))}

      <div className="relative max-w-6xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <p className="eyebrow-stitch mb-6 reveal" style={{ color: "#F7D154" }}>
          For the Most Important Day
        </p>

        {/* Big stitched heading */}
        <svg
          className="w-full max-w-3xl mx-auto mb-4 reveal"
          viewBox="0 0 800 110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="80%"
            textAnchor="middle"
            fontFamily="Cinzel, serif"
            fontSize="76"
            fontWeight="700"
            letterSpacing="10"
            fill="rgba(228,184,74,0.05)"
            stroke="none"
          >
            BRIDAL
          </text>
          <text
            x="50%"
            y="80%"
            textAnchor="middle"
            fontFamily="Cinzel, serif"
            fontSize="76"
            fontWeight="700"
            letterSpacing="10"
            fill="none"
            stroke="#F7D154"
            strokeWidth="1.3"
            strokeDasharray="5 2.5"
            strokeLinecap="round"
          >
            BRIDAL
          </text>
        </svg>

        <svg
          className="w-full max-w-xl mx-auto mb-8 reveal"
          viewBox="0 0 600 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="78%"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="38"
            fontWeight="300"
            fontStyle="italic"
            letterSpacing="10"
            fill="rgba(228,184,74,0.06)"
            stroke="none"
          >
            COLLECTION
          </text>
          <text
            x="50%"
            y="78%"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="38"
            fontWeight="300"
            fontStyle="italic"
            letterSpacing="10"
            fill="none"
            stroke="#E6B400"
            strokeWidth="0.9"
            strokeDasharray="4 2"
            strokeLinecap="round"
          >
            COLLECTION
          </text>
        </svg>

        <p
          className="text-gold-pale/65 max-w-2xl mx-auto leading-loose mb-10 reveal"
          style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.15rem" }}
        >
          Your bridal trousseau is more than attire — it is heritage, identity and artistry
          woven into silk and thread. At Trinetra By Rajababu, we create the ensemble that
          makes you unforgettable.
        </p>

        {/* Bridal lehenga showcase photo */}
        <div className="relative mb-14 mx-auto reveal" style={{ maxWidth: "460px" }}>
          <div
            className="relative overflow-hidden aspect-[23/24]"
            style={{
              border: "1px solid rgba(201,146,42,0.35)",
              outline: "1px solid rgba(201,146,42,0.12)",
              outlineOffset: "6px",
            }}
          >
            <Image
              src="/bridal-lehenga.jpg"
              alt="Bridal Lehenga by Trinetra"
              fill
              sizes="(max-width: 640px) 100vw, 460px"
              style={{
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />
            {/* Vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(0deg, rgba(60,8,8,0.75) 0%, transparent 52%)" }}
            />
            {/* Corner accents */}
            {(["tl", "tr", "bl", "br"] as const).map((pos) => (
              <div
                key={pos}
                className="absolute"
                style={{
                  top: pos.startsWith("t") ? 12 : "auto",
                  bottom: pos.startsWith("b") ? 12 : "auto",
                  left: pos.endsWith("l") ? 12 : "auto",
                  right: pos.endsWith("r") ? 12 : "auto",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  style={{ transform: `rotate(${pos === "tl" ? 0 : pos === "tr" ? 90 : pos === "bl" ? 270 : 180}deg)` }}
                >
                  <path d="M2 18 L2 2 L18 2" fill="none" stroke="#E6B400" strokeWidth="1" strokeOpacity="0.5" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {bridalHighlights.map((item, i) => (
            <Link
              key={i}
              href={`/shop?category=${encodeURIComponent(item.category)}`}
              className="reveal text-left p-7 relative overflow-hidden group block"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(201,146,42,0.25)",
                outline: "1px solid rgba(201,146,42,0.08)",
                outlineOffset: "4px",
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {/* Corner accent */}
              <svg
                className="absolute top-3 right-3 opacity-30"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2 18 L2 2 L18 2"
                  fill="none"
                  stroke="#E6B400"
                  strokeWidth="1"
                />
              </svg>

              <span className="text-gold text-xl mb-4 block">{item.icon}</span>

              {/* Stitched card title */}
              <svg className="mb-4 w-full" viewBox="0 0 250 38" xmlns="http://www.w3.org/2000/svg">
                <text
                  x="0"
                  y="80%"
                  fontFamily="Cinzel, serif"
                  fontSize="21"
                  fontWeight="600"
                  letterSpacing="3"
                  fill="rgba(228,184,74,0.06)"
                >
                  {item.title.toUpperCase()}
                </text>
                <text
                  x="0"
                  y="80%"
                  fontFamily="Cinzel, serif"
                  fontSize="21"
                  fontWeight="600"
                  letterSpacing="3"
                  fill="none"
                  stroke="#F7D154"
                  strokeWidth="0.8"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                >
                  {item.title.toUpperCase()}
                </text>
              </svg>

              <p
                className="text-warm-white/50 leading-relaxed"
                style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1rem" }}
              >
                {item.desc}
              </p>

              {/* Bottom thread */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(201,146,42,0.4), transparent)",
                }}
              />
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 reveal">
          <a href="#contact" className="btn-gold">
            Book Bridal Consultation
          </a>
          <Link href="/shop?category=Bridal%20Lehengas" className="btn-outline-gold">
            View Full Bridal Range
          </Link>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #E6B400, #F7D154, #E6B400, transparent)" }}
      />
    </section>
  );
}
