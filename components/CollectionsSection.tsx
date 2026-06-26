"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const collections = [
  {
    id: 1,
    category: "Bridal Lehengas",
    subtitle: "The Crown of Every Celebration",
    description:
      "Handcrafted with real zardozi, intricate gota patti and Swarovski work. Every bridal lehenga is a masterpiece woven from generations of artisanship.",
    gradient: "linear-gradient(160deg, rgba(92,14,14,0.72) 0%, rgba(139,26,26,0.65) 50%, rgba(168,32,32,0.60) 100%)",
    accentColor: "#E4B84A",
    pattern: "bridal",
    image: "/bridal-lehenga.jpg",
  },
  {
    id: 2,
    category: "Heritage Sarees",
    subtitle: "Six Yards of Timeless Grace",
    description:
      "Banarasi silks, Kanjivaram wonders and Chanderi delicacies — each saree carries the soul of a weaver's lifetime devotion.",
    gradient: "linear-gradient(160deg, #2C1654 0%, #4A2080 50%, #6B36A8 100%)",
    accentColor: "#F5E6C0",
    pattern: "saree",
    image: "",
  },
  {
    id: 3,
    category: "Punjabi Suits",
    subtitle: "Elegance in Every Silhouette",
    description:
      "Phulkari embroidery, mirror work and hand-blocked prints meet contemporary silhouettes in our celebrated suit collections.",
    gradient: "linear-gradient(160deg, rgba(13,51,72,0.70) 0%, rgba(26,82,118,0.65) 50%, rgba(40,116,166,0.60) 100%)",
    accentColor: "#E4B84A",
    pattern: "suit",
    image: "/white-sharara-set.jpg",
  },
  {
    id: 4,
    category: "Chaniya Choli",
    subtitle: "Colours of Navratri",
    description:
      "Vibrant mirror-work, bandhani prints and intricate threadwork chaniya cholis that make every garba a celebration.",
    gradient: "linear-gradient(160deg, rgba(26,58,26,0.70) 0%, rgba(46,125,50,0.65) 50%, rgba(56,142,60,0.60) 100%)",
    accentColor: "#E4B84A",
    pattern: "chaniya",
    image: "/pink-palazzo-suit.jpg",
  },
  {
    id: 5,
    category: "Designer Kurtas",
    subtitle: "Comfort Meets Craftsmanship",
    description:
      "Hand-block prints, chikankari work and contemporary embroidery on premium cotton, silk and linen for everyday elegance.",
    gradient: "linear-gradient(160deg, rgba(58,42,26,0.70) 0%, rgba(109,76,65,0.65) 50%, rgba(141,110,99,0.60) 100%)",
    accentColor: "#F5E6C0",
    pattern: "kurta",
    image: "/kurtis-collection.jpg",
  },
  {
    id: 6,
    category: "Bridal Blouses",
    subtitle: "The Finishing Masterpiece",
    description:
      "From deep-neck heavily embellished pieces to classic mango designs — our master blouse craftsmen ensure perfection.",
    gradient: "linear-gradient(160deg, rgba(26,48,64,0.72) 0%, rgba(44,80,106,0.65) 50%, rgba(61,107,140,0.60) 100%)",
    accentColor: "#E4B84A",
    pattern: "blouse",
    image: "/brocade-blouse-front.jpg",
  },
];

/* Collection card patterns — rendered as SVG overlays */
function CardPattern({ pattern }: { pattern: string }) {
  if (pattern === "bridal")
    return (
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="p-bridal" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M30 5 C35 20 55 20 55 30 C55 40 35 40 30 55 C25 40 5 40 5 30 C5 20 25 20 30 5Z"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <circle cx="30" cy="30" r="5" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p-bridal)" />
      </svg>
    );

  if (pattern === "saree")
    return (
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="p-saree" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="0.8" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.4" />
            <circle cx="20" cy="20" r="3" fill="white" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p-saree)" />
      </svg>
    );

  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`p-${pattern}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect x="10" y="10" width="10" height="10" fill="none" stroke="white" strokeWidth="0.6" transform="rotate(45 15 15)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#p-${pattern})`} />
    </svg>
  );
}

export default function CollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="relative py-16 sm:py-24 linen-bg"
    >
      {/* Subtle linen tint overlay */}
      <div className="absolute inset-0 bg-ivory/70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <p className="eyebrow-stitch mb-4">Curated for You</p>

          {/* Stitched SVG heading */}
          <svg
            className="w-full max-w-2xl mx-auto mb-2"
            viewBox="0 0 700 90"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="64"
              fontWeight="700"
              letterSpacing="12"
              fill="rgba(201,146,42,0.06)"
              stroke="none"
            >
              COLLECTIONS
            </text>
            <text
              ref={headingRef}
              x="50%"
              y="78%"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="64"
              fontWeight="700"
              letterSpacing="12"
              className="stitch-static"
            >
              COLLECTIONS
            </text>
          </svg>

          <div className="divider-dash max-w-xs mx-auto mt-4" />

          <p
            className="text-taupe max-w-xl mx-auto mt-6 leading-relaxed text-base"
            style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem" }}
          >
            Each piece in our atelier is a dialogue between the ancient hands of Indian
            craftsmen and the modern soul of couture.
          </p>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, idx) => (
            <Link
              key={col.id}
              href={`/shop?category=${encodeURIComponent(col.category)}`}
              className="collection-card reveal group block h-[340px] sm:h-[420px]"
              style={{
                animationDelay: `${idx * 0.12}s`,
              }}
            >
              {/* Background — photo if available, else gradient */}
              {col.image ? (
                <>
                  <div
                    className="card-inner absolute inset-0"
                    style={{
                      backgroundImage: `url('${col.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center top",
                    }}
                  />
                  {/* Brand-colour gradient overlay on top of photo */}
                  <div
                    className="absolute inset-0"
                    style={{ background: col.gradient }}
                  />
                </>
              ) : (
                <div
                  className="card-inner absolute inset-0"
                  style={{ background: col.gradient }}
                />
              )}

              {/* Pattern overlay */}
              <CardPattern pattern={col.pattern} />

              {/* Thread border accent */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <rect
                  x="8"
                  y="8"
                  width="91%"
                  height="91%"
                  fill="none"
                  stroke="rgba(201,146,42,0.2)"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Corner diamond */}
              <div className="absolute top-4 right-4 z-[3] opacity-40">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <rect x="3" y="3" width="6" height="6" fill={col.accentColor} transform="rotate(45 6 6)" />
                </svg>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 z-[4] flex flex-col justify-end p-7">
                <span
                  className="text-[9px] tracking-[0.45em] uppercase mb-3 opacity-70"
                  style={{
                    color: col.accentColor,
                    fontFamily: "var(--font-jost), sans-serif",
                  }}
                >
                  {col.subtitle}
                </span>

                {/* Card heading — stitched SVG */}
                <svg
                  className="mb-3 w-full"
                  viewBox="0 0 300 42"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <text
                    x="2"
                    y="82%"
                    fontFamily="Cinzel, serif"
                    fontSize="26"
                    fontWeight="600"
                    letterSpacing="3"
                    fill={`${col.accentColor}15`}
                    stroke="none"
                  >
                    {col.category}
                  </text>
                  <text
                    x="2"
                    y="82%"
                    fontFamily="Cinzel, serif"
                    fontSize="26"
                    fontWeight="600"
                    letterSpacing="3"
                    fill="none"
                    stroke={col.accentColor}
                    strokeWidth="0.9"
                    strokeDasharray="4 2"
                    strokeLinecap="round"
                  >
                    {col.category}
                  </text>
                </svg>

                <p
                  className="text-warm-white/60 text-sm leading-relaxed mb-5 max-w-[240px]"
                  style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "0.95rem" }}
                >
                  {col.description}
                </p>

                <span
                  className="inline-flex items-center gap-3 group/link"
                  style={{
                    color: col.accentColor,
                    fontFamily: "var(--font-jost), sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                  }}
                >
                  Shop Now
                  <span className="inline-block w-6 h-px bg-current transition-all duration-300 group-hover/link:w-10" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
