export default function MarqueeStrip() {
  const items = [
    "Bridal Lehengas",
    "Heritage Sarees",
    "Chaniya Choli",
    "Punjabi Suits",
    "Designer Kurtas",
    "Bridal Blouses",
    "Wedding Sherwanis",
    "Festive Wear",
    "Embroidered Sarees",
    "Occasion Wear",
  ];

  const allItems = [...items, ...items]; // doubled for seamless loop

  return (
    <div
      className="relative overflow-hidden py-4 border-y"
      style={{
        background: "linear-gradient(90deg, #1E1610 0%, #2a1a10 50%, #1E1610 100%)",
        borderColor: "rgba(201,146,42,0.3)",
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #1E1610, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, #1E1610, transparent)" }}
      />

      <div
        className="flex whitespace-nowrap"
        style={{ animation: "scrollMarquee 35s linear infinite" }}
      >
        {allItems.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-4 mx-3"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            <span className="text-gold/80 text-[10px] tracking-[0.4em] uppercase font-light">
              {item}
            </span>
            {/* Cross-stitch separator */}
            <svg width="8" height="8" viewBox="0 0 8 8" className="flex-shrink-0">
              <line x1="0" y1="0" x2="8" y2="8" stroke="#C9922A" strokeWidth="1" opacity="0.5" />
              <line x1="8" y1="0" x2="0" y2="8" stroke="#C9922A" strokeWidth="1" opacity="0.5" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
