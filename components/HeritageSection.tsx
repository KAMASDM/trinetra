"use client";

import { useEffect, useRef } from "react";

const stats = [
  { value: "30+", label: "Years of Heritage" },
  { value: "150+", label: "Master Craftsmen" },
  { value: "50K+", label: "Happy Families" },
  { value: "12", label: "States We Serve" },
];

function MandalaDecor() {
  return (
    <svg
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full opacity-70 animate-rotate-slow"
      style={{ transformOrigin: "center" }}
    >
      {/* Outer decorative ring */}
      <circle cx="150" cy="150" r="140" fill="none" stroke="#E6B400" strokeWidth="0.5" strokeDasharray="4 3" />
      <circle cx="150" cy="150" r="120" fill="none" stroke="#E6B400" strokeWidth="0.3" />

      {/* 8-petal flower */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 150 150)`}>
          <path
            d="M150 30 C160 80 195 85 195 150 C195 85 230 80 150 30Z"
            fill="none"
            stroke="#E6B400"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            opacity="0.6"
          />
        </g>
      ))}

      {/* Inner circles */}
      <circle cx="150" cy="150" r="70" fill="none" stroke="#E6B400" strokeWidth="0.4" strokeDasharray="3 2" />
      <circle cx="150" cy="150" r="40" fill="none" stroke="#E6B400" strokeWidth="0.6" />
      <circle cx="150" cy="150" r="15" fill="none" stroke="#E6B400" strokeWidth="1" />

      {/* Cardinal dots */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 150 + 70 * Math.sin(rad);
        const y = 150 - 70 * Math.cos(rad);
        return <circle key={angle} cx={x} cy={y} r="3" fill="#E6B400" opacity="0.7" />;
      })}

      {/* Centre diamond */}
      <rect x="143" y="143" width="14" height="14" fill="#E6B400" opacity="0.5" transform="rotate(45 150 150)" />

      {/* 16-point fine details */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const x1 = 150 + 100 * Math.sin(rad);
        const y1 = 150 - 100 * Math.cos(rad);
        const x2 = 150 + 115 * Math.sin(rad);
        const y2 = 150 - 115 * Math.cos(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#E6B400"
            strokeWidth="0.8"
            opacity="0.4"
          />
        );
      })}
    </svg>
  );
}

export default function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="heritage"
      ref={sectionRef}
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1E1610 0%, #2a1a0e 50%, #1E1610 100%)" }}
    >
      {/* Linen texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/linen-bg.avif')",
          backgroundRepeat: "repeat",
          backgroundSize: "320px 320px",
        }}
      />

      {/* Gold gradient top accent */}
      <div className="divider-gold" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Text ── */}
          <div className="reveal">
            <p className="eyebrow-stitch mb-6" style={{ color: "#F7D154" }}>
              Our Story
            </p>

            {/* Stitched heading */}
            <svg
              className="w-full max-w-lg mb-6"
              viewBox="0 0 500 80"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="0"
                y="78%"
                fontFamily="Cinzel, serif"
                fontSize="54"
                fontWeight="700"
                letterSpacing="8"
                fill="rgba(201,146,42,0.06)"
                stroke="none"
              >
                HERITAGE
              </text>
              <text
                x="0"
                y="78%"
                fontFamily="Cinzel, serif"
                fontSize="54"
                fontWeight="700"
                letterSpacing="8"
                className="stitch-static"
              >
                HERITAGE
              </text>
            </svg>

            <p
              className="text-gold-light/80 text-lg leading-loose mb-6"
              style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}
            >
              &ldquo;Crafted with Devotion, Worn with Grace&rdquo;
            </p>

            <p
              className="text-warm-white/55 leading-loose mb-5 text-[15px]"
              style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.05rem" }}
            >
              At Trinetra By Rajababu, every garment is a living testament to India&rsquo;s
              unparalleled craft heritage. From opulent bridal lehengas to artisan designer
              blouses and festive suits, our collections carry the soul of a civilisation
              that has always celebrated beauty in its most exquisite form.
            </p>

            <p
              className="text-warm-white/50 leading-loose mb-8 text-[15px]"
              style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.05rem" }}
            >
              Handpicked fabrics, master embroiderers and a passionate design vision — each
              ensemble is curated so that you don&rsquo;t merely wear a garment; you wear a story
              passed down through generations.
            </p>

            {/* Thread divider */}
            <div className="divider-dash mb-8" />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p
                    className="gold-shimmer text-3xl font-bold mb-1"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-warm-white/40 text-[9px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: "var(--font-jost), sans-serif" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Mandala ── */}
          <div className="reveal relative flex items-center justify-center pb-12 sm:pb-16">
            <div className="relative w-full max-w-sm aspect-square">
              {/* Background glow */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(201,146,42,0.06) 0%, transparent 70%)",
                }}
              />

              {/* Decorative rings (static) */}
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 330 330"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="165" cy="165" r="160" fill="none" stroke="#E6B400" strokeWidth="1" strokeDasharray="6 4" />
              </svg>

              <MandalaDecor />

              {/* Centre quote card */}
              <div
                className="absolute inset-8 sm:inset-14 flex flex-col items-center justify-center text-center rounded-full"
                style={{ background: "radial-gradient(circle, rgba(30,22,16,0.8) 0%, transparent 100%)" }}
              >
                <svg width="30" height="20" viewBox="0 0 30 20" className="opacity-60">
                  <text fontSize="28" y="18" fontFamily="serif" fill="#E6B400">&ldquo;</text>
                </svg>
              </div>

              {/* Quote, curved along the circle's underside */}
              <svg
                className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[58%] w-[112%]"
                viewBox="0 0 300 70"
                style={{ overflow: "visible" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path id="heritageQuoteArc" d="M 0 18 A 300 300 0 0 0 300 18" fill="none" />
                <text fontSize="12.5" letterSpacing="0.5" fill="var(--gold-light)" fillOpacity="0.85" fontStyle="italic" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  <textPath href="#heritageQuoteArc" startOffset="50%" textAnchor="middle">
                    Every stitch is a prayer, every thread a blessing
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-gold mt-0" />
    </section>
  );
}
