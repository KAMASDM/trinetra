"use client";

import Image from "next/image";
import { useConsultation } from "./ConsultationContext";

const CONSULTATION_LINKS = new Set(["Bridal Consult", "Book Appointment"]);

const footerLinks = {
  Collections: ["Shop All", "Bridal Lehengas", "Dress Materials", "Designer Kurtas", "Chaniya Choli", "Bridal Blouses"],
  Studio: ["Our Heritage", "Craftsmanship", "Bridal Consult", "Book Appointment", "My Orders"],
  Policies: ["Terms & Conditions", "Privacy Policy", "Refund Policy", "Track Order"],
};

const footerHrefs: Record<string, string> = {
  "Shop All": "/shop",
  "Bridal Lehengas": "/shop",
  "Dress Materials": "/shop",
  "Designer Kurtas": "/shop",
  "Chaniya Choli": "/shop",
  "Bridal Blouses": "/shop",
  "Our Heritage": "/#heritage",
  Craftsmanship: "/#craftsmanship",
  "My Orders": "/account/orders",
  "Terms & Conditions": "/terms",
  "Privacy Policy": "/privacy",
  "Refund Policy": "/refund-policy",
  "Track Order": "/track-order",
};

export default function Footer() {
  const consultation = useConsultation();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#0E0A06" }}
    >
      {/* Gold top border */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #E6B400, #F7D154, #E6B400, transparent)",
        }}
      />

      {/* Main footer body */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/logo.png"
                alt="Trinetra Logo"
                width={48}
                height={48}
                className="w-12 h-12"
                style={{ objectFit: "contain" }}
              />

              <div>
                <svg viewBox="0 0 200 30" className="w-36" xmlns="http://www.w3.org/2000/svg">
                  <text
                    x="0"
                    y="85%"
                    fontFamily="Cinzel, serif"
                    fontSize="18"
                    fontWeight="700"
                    letterSpacing="4"
                    fill="rgba(201,146,42,0.06)"
                  >
                    TRINETRA
                  </text>
                  <text
                    x="0"
                    y="85%"
                    fontFamily="Cinzel, serif"
                    fontSize="18"
                    fontWeight="700"
                    letterSpacing="4"
                    fill="none"
                    stroke="#E6B400"
                    strokeWidth="0.7"
                    strokeDasharray="3 1.5"
                    strokeLinecap="round"
                  >
                    TRINETRA
                  </text>
                </svg>
                <p
                  className="text-gold-light/50 text-[9px] tracking-[0.35em] uppercase mt-1"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  By Rajababu
                </p>
              </div>
            </div>

            <p
              className="text-warm-white/35 leading-loose mb-6 text-sm max-w-xs"
              style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "1rem" }}
            >
              Where India&rsquo;s richest traditions are woven into every thread. Heritage
              couture crafted with devotion, worn with grace.
            </p>

            {/* Instagram link */}
            <a
              href="https://www.instagram.com/trinetrabyrajababu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
              style={{
                background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                padding: "8px 18px",
                borderRadius: "2px",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span
                className="text-white text-[10px] tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                Follow Us
              </span>
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-1">
              {/* Column title — stitched */}
              <svg viewBox="0 0 160 28" className="mb-5" xmlns="http://www.w3.org/2000/svg">
                <text
                  x="0"
                  y="85%"
                  fontFamily="Cinzel, serif"
                  fontSize="14"
                  fontWeight="600"
                  letterSpacing="4"
                  fill="rgba(201,146,42,0.06)"
                >
                  {title.toUpperCase()}
                </text>
                <text
                  x="0"
                  y="85%"
                  fontFamily="Cinzel, serif"
                  fontSize="14"
                  fontWeight="600"
                  letterSpacing="4"
                  fill="none"
                  stroke="#E6B400"
                  strokeWidth="0.7"
                  strokeDasharray="3 1.5"
                  strokeLinecap="round"
                >
                  {title.toUpperCase()}
                </text>
              </svg>

              <ul className="space-y-3">
                {links.map((link) => {
                  const className = "text-warm-white/35 hover:text-gold transition-colors duration-300 text-[12px] tracking-wider flex items-center gap-2 group";
                  const dot = <span className="w-2 h-px bg-gold/0 group-hover:bg-gold/60 transition-all duration-300" />;
                  return (
                    <li key={link}>
                      {CONSULTATION_LINKS.has(link) ? (
                        <button type="button" onClick={consultation.open} className={className} style={{ fontFamily: "var(--font-jost), sans-serif" }}>
                          {dot}
                          {link}
                        </button>
                      ) : (
                        <a href={footerHrefs[link] ?? "#"} className={className} style={{ fontFamily: "var(--font-jost), sans-serif" }}>
                          {dot}
                          {link}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider-dash mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-warm-white/20 text-[10px] tracking-[0.3em] uppercase text-center"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            © {new Date().getFullYear()} Trinetra By Rajababu. All Rights Reserved.
          </p>

          {/* Small stitched tagline */}
          <svg viewBox="0 0 340 20" className="w-60 opacity-30" xmlns="http://www.w3.org/2000/svg">
            <text
              x="50%"
              y="85%"
              textAnchor="middle"
              fontFamily="Cormorant Garamond, serif"
              fontSize="12"
              fontStyle="italic"
              letterSpacing="4"
              fill="none"
              stroke="#E6B400"
              strokeWidth="0.5"
              strokeDasharray="2 1"
            >
              Crafted with devotion, worn with grace
            </text>
          </svg>
        </div>
      </div>

      {/* Decorative bottom pattern */}
      <div
        className="h-0.5 w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg, #E6B400 0px, #E6B400 5px, transparent 5px, transparent 10px)",
          opacity: 0.15,
        }}
      />
    </footer>
  );
}
