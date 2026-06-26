"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Delhi",
    role: "Bride, Winter 2024",
    stars: 5,
    quote:
      "My bridal lehenga from Trinetra was nothing short of a dream. The zardozi work was breathtaking and the fitting was absolutely perfect. Every uncle and aunty kept asking where it was from throughout the wedding. Truly a heritage piece I will treasure forever.",
  },
  {
    name: "Kavita Patel",
    location: "Mumbai",
    role: "Customer Since 2018",
    stars: 5,
    quote:
      "I have been buying sarees from Rajababu for six years now. The quality of Banarasi silk and the attention to detail in the blouse stitching is unmatched anywhere in the city. This is not just a shop — it is custodian of Indian textile art.",
  },
  {
    name: "Sunita Mehrotra",
    location: "Lucknow",
    role: "Mother of the Bride",
    stars: 5,
    quote:
      "We ordered the entire bridal trousseau — lehenga, sarees and suits — from Trinetra. The team was patient, meticulous and deeply knowledgeable. My daughter was the most beautifully dressed bride in the family history. Worth every rupee.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14">
          <polygon
            points="7,1 8.5,5.5 13,5.5 9.5,8.5 10.8,13 7,10 3.2,13 4.5,8.5 1,5.5 5.5,5.5"
            fill={i < count ? "#C9922A" : "none"}
            stroke="#C9922A"
            strokeWidth="0.6"
          />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
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
      ref={sectionRef}
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1E1610 0%, #2a1908 50%, #1E1610 100%)" }}
    >
      {/* Subtle linen */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/linen-bg.avif')",
          backgroundRepeat: "repeat",
          backgroundSize: "320px 320px",
        }}
      />

      {/* Decorative background text */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none"
        viewBox="0 0 600 200"
        style={{ width: "90%", maxWidth: "800px" }}
      >
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="120"
          fontWeight="700"
          fill="#C9922A"
        >
          VOICES
        </text>
      </svg>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="eyebrow-stitch mb-4" style={{ color: "#E4B84A" }}>
            What Our Patrons Say
          </p>

          <svg
            className="w-full max-w-xl mx-auto"
            viewBox="0 0 620 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="52"
              fontWeight="700"
              letterSpacing="10"
              fill="rgba(228,184,74,0.05)"
            >
              TESTIMONIALS
            </text>
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="52"
              fontWeight="700"
              letterSpacing="10"
              fill="none"
              stroke="#E4B84A"
              strokeWidth="1.1"
              strokeDasharray="5 2.5"
              strokeLinecap="round"
              opacity="0.8"
            >
              TESTIMONIALS
            </text>
          </svg>

          <div className="divider-dash max-w-xs mx-auto mt-4" />
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="reveal relative p-8 group"
              style={{
                background: "rgba(255,253,248,0.03)",
                border: "1px solid rgba(201,146,42,0.2)",
                animationDelay: `${i * 0.18}s`,
              }}
            >
              {/* Thread border corners */}
              <svg className="absolute top-0 left-0 w-10 h-10 opacity-40" viewBox="0 0 40 40">
                <path d="M2 38 L2 2 L38 2" fill="none" stroke="#C9922A" strokeWidth="1" strokeDasharray="3 2" />
              </svg>
              <svg className="absolute bottom-0 right-0 w-10 h-10 opacity-40" viewBox="0 0 40 40">
                <path d="M38 2 L38 38 L2 38" fill="none" stroke="#C9922A" strokeWidth="1" strokeDasharray="3 2" />
              </svg>

              {/* Large decorative quote mark */}
              <svg className="w-10 h-8 mb-5 opacity-25" viewBox="0 0 50 35">
                <text y="100%" fontFamily="Georgia, serif" fontSize="52" fill="#C9922A">&ldquo;</text>
              </svg>

              {/* Stars */}
              <div className="mb-5">
                <StarRating count={t.stars} />
              </div>

              {/* Quote */}
              <p
                className="text-warm-white/55 leading-loose mb-8 text-sm"
                style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "1.05rem" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-gold text-sm font-bold"
                  style={{
                    background: "rgba(201,146,42,0.12)",
                    border: "1px solid rgba(201,146,42,0.3)",
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: "0.85rem",
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-gold text-xs font-semibold tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.7rem" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-warm-white/30 text-[10px] tracking-wider"
                    style={{ fontFamily: "var(--font-jost), sans-serif" }}
                  >
                    {t.location} · {t.role}
                  </p>
                </div>
              </div>

              {/* Bottom divider */}
              <div className="divider-dash mt-6" />
            </div>
          ))}
        </div>

        {/* Google reviews / trust badge */}
        <div className="text-center mt-14 reveal">
          <p
            className="text-warm-white/30 text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            4.9 · Rated by 2,400+ customers on Google
          </p>
        </div>
      </div>
    </section>
  );
}
