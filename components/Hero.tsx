"use client";

import { useEffect, useRef } from "react";

/* Decorative mandala / paisley petals around the hero */
function FloatingPetal({ x, y, delay, size }: { x: string; y: string; delay: number; size: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, animationDelay: `${delay}s` }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className="animate-float-up opacity-30"
        style={{ animationDelay: `${delay}s` }}
      >
        <path
          d="M20 2 C24 10 38 10 38 20 C38 30 24 30 20 38 C16 30 2 30 2 20 C2 10 16 10 20 2Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />
        <circle cx="20" cy="20" r="3" fill="#FFFFFF" opacity="0.4" />
      </svg>
    </div>
  );
}

/* Decorative corner ornament */
function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const rot = { tl: 0, tr: 90, bl: 270, br: 180 }[pos];
  const cls: Record<string, string> = {
    tl: "top-8 left-8",
    tr: "top-8 right-8",
    bl: "bottom-8 left-8",
    br: "bottom-8 right-8",
  };
  return (
    <div className={`absolute ${cls[pos]} hidden md:block pointer-events-none`}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        style={{ transform: `rotate(${rot}deg)` }}
        className="animate-border-draw"
      >
        <path
          d="M2 78 L2 2 L78 2"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeDasharray="2000"
          strokeDashoffset="0"
          opacity="0.5"
        />
        {/* Small diamond accent */}
        <rect x="0" y="0" width="5" height="5" fill="#FFFFFF" opacity="0.6" transform="rotate(45 2.5 2.5)" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleParallax = () => {
      if (!sectionRef.current) return;
      const y = window.scrollY * 0.3;
      sectionRef.current.style.backgroundPositionY = `calc(center + ${y}px)`;
    };
    window.addEventListener("scroll", handleParallax, { passive: true });
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/linen-bg.avif')",
        backgroundRepeat: "repeat",
        backgroundSize: "320px 320px",
        backgroundPosition: "center",
      }}
    >
      {/* Deep warm overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(92,14,14,0.65) 0%, rgba(30,22,16,0.75) 50%, rgba(92,14,14,0.55) 100%)",
        }}
      />

      {/* Radial glow from centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,146,42,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Floating petals */}
      <FloatingPetal x="8%" y="15%" delay={0}    size={30} />
      <FloatingPetal x="88%" y="12%" delay={0.8} size={25} />
      <FloatingPetal x="5%" y="68%" delay={1.6}  size={20} />
      <FloatingPetal x="92%" y="70%" delay={2.4} size={28} />
      <FloatingPetal x="50%" y="6%" delay={1.2}  size={22} />
      <FloatingPetal x="20%" y="85%" delay={0.4} size={18} />
      <FloatingPetal x="75%" y="82%" delay={2.0} size={24} />

      {/* Corner ornaments */}
      <CornerOrnament pos="tl" />
      <CornerOrnament pos="tr" />
      <CornerOrnament pos="bl" />
      <CornerOrnament pos="br" />

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        {/* Eyebrow */}
        <p
          className="eyebrow-stitch mb-8 animate-fade-in"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          Heritage Couture · Est. Since Generations
        </p>

        {/* ── STITCHED SVG TITLE ── */}
        <div className="relative">
          {/* Ghost fill so text is readable while animation plays */}
          <svg
            className="w-full max-w-4xl mx-auto"
            viewBox="0 0 860 130"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Trinetra"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ghost layer — very faint fill, always visible */}
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="100"
              fontWeight="700"
              letterSpacing="18"
              fill="rgba(201,146,42,0.07)"
              stroke="none"
            >
              TRINETRA
            </text>

            {/* Animated stitched stroke */}
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="100"
              fontWeight="700"
              letterSpacing="18"
              filter="url(#glow)"
              className="stitch-draw"
            >
              TRINETRA
            </text>
          </svg>

          {/* Sub-brand name */}
          <svg
            className="w-full max-w-2xl mx-auto -mt-2"
            viewBox="0 0 640 60"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="By Rajababu"
          >
            <text
              x="50%"
              y="75%"
              textAnchor="middle"
              fontFamily="Cormorant Garamond, serif"
              fontSize="32"
              fontWeight="300"
              fontStyle="italic"
              letterSpacing="14"
              fill="rgba(228,184,74,0.1)"
              stroke="none"
            >
              By Rajababu
            </text>
            <text
              x="50%"
              y="75%"
              textAnchor="middle"
              fontFamily="Cormorant Garamond, serif"
              fontSize="32"
              fontWeight="300"
              fontStyle="italic"
              letterSpacing="14"
              className="stitch-draw-sub"
            >
              By Rajababu
            </text>
          </svg>
        </div>

        {/* Gold dashed divider */}
        <div className="flex items-center gap-4 my-8 max-w-xs mx-auto">
          <div className="flex-1 h-px" style={{ background: "repeating-linear-gradient(90deg, #C9922A 0px, #C9922A 5px, transparent 5px, transparent 9px)" }} />
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="3" y="3" width="6" height="6" fill="#C9922A" transform="rotate(45 6 6)" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "repeating-linear-gradient(90deg, #C9922A 0px, #C9922A 5px, transparent 5px, transparent 9px)" }} />
        </div>

        {/* Tagline */}
        <p
          className="text-gold-pale/80 whitespace-nowrap tracking-[0.1em] sm:tracking-[0.2em] max-w-xl mx-auto leading-relaxed animate-fade-in-up"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            animationDelay: "2s",
            opacity: 0,
            fontSize: "clamp(0.6rem, 3.1vw, 1.05rem)",
          }}
        >
          Where India&rsquo;s richest traditions are woven into every thread
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up"
          style={{ animationDelay: "2.5s", opacity: 0 }}
        >
          <a href="#collections" className="btn-gold">
            Explore Collections
          </a>
          <a href="#bridal" className="btn-outline-gold">
            Bridal Consult
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-16 flex flex-col items-center gap-2 animate-fade-in-up"
          style={{ animationDelay: "3s", opacity: 0 }}
        >
          <p
            className="text-white/80 text-xs tracking-[0.5em] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            Scroll to discover
          </p>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse-gold" />
        </div>
      </div>
    </section>
  );
}
