type BorderVariant = "kutchi" | "jaipuri" | "banarasi" | "phulkari" | "kalamkari";

export default function RegionalCraftBorder({ variant }: { variant: BorderVariant }) {
  return (
    <div
      aria-hidden="true"
      className="relative z-[3] h-10 overflow-hidden linen-bg sm:h-12 lg:h-14"
    >
      <div className="absolute inset-0 bg-ivory/80" />
      <svg
        className="relative left-1/2 h-full -translate-x-1/2"
        style={{ width: "max(100%, 920px)" }}
        viewBox="0 0 1440 56"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {variant === "kutchi" && <KutchiPattern />}
        {variant === "jaipuri" && <JaipuriPattern />}
        {variant === "banarasi" && <BanarasiPattern />}
        {variant === "phulkari" && <PhulkariPattern />}
        {variant === "kalamkari" && <KalamkariPattern />}
      </svg>
    </div>
  );
}

function KutchiPattern() {
  return (
    <>
      <defs>
        <pattern id="regional-kutchi" x="0" y="0" width="128" height="56" patternUnits="userSpaceOnUse">
          <rect x="0" y="13" width="128" height="30" fill="rgba(139,26,26,0.08)" />
          <path d="M0 14H128M0 42H128" stroke="rgba(139,26,26,0.35)" strokeWidth="1" strokeDasharray="5 6" />
          <path d="M0 21H128M0 35H128" stroke="rgba(230,180,0,0.46)" strokeWidth="1.2" strokeDasharray="2 8" />
          <path d="M32 6L54 28L32 50L10 28Z" fill="rgba(14,91,124,0.18)" stroke="rgba(14,91,124,0.62)" strokeWidth="1.4" />
          <path d="M96 6L118 28L96 50L74 28Z" fill="rgba(199,42,94,0.18)" stroke="rgba(199,42,94,0.58)" strokeWidth="1.4" />
          <path d="M32 16L44 28L32 40L20 28Z" fill="rgba(230,180,0,0.3)" stroke="rgba(230,180,0,0.62)" strokeWidth="1" />
          <path d="M96 16L108 28L96 40L84 28Z" fill="rgba(38,132,70,0.24)" stroke="rgba(38,132,70,0.58)" strokeWidth="1" />
          <path d="M64 10L73 28L64 46L55 28Z" fill="none" stroke="rgba(230,102,28,0.55)" strokeWidth="1.3" />
          <path d="M0 28C8 21 16 21 24 28S40 35 48 28S64 21 72 28S88 35 96 28S112 21 120 28S136 35 144 28" fill="none" stroke="rgba(230,102,28,0.4)" strokeWidth="1" />
          <circle cx="32" cy="28" r="4" fill="rgba(255,253,248,0.82)" stroke="rgba(14,91,124,0.38)" strokeWidth="1" />
          <circle cx="96" cy="28" r="4" fill="rgba(255,253,248,0.82)" stroke="rgba(199,42,94,0.35)" strokeWidth="1" />
          <circle cx="64" cy="28" r="2.7" fill="rgba(255,253,248,0.76)" stroke="rgba(230,102,28,0.35)" strokeWidth="0.8" />
          <circle cx="16" cy="19" r="2" fill="rgba(199,42,94,0.5)" />
          <circle cx="48" cy="37" r="2" fill="rgba(38,132,70,0.45)" />
          <circle cx="80" cy="19" r="2" fill="rgba(230,180,0,0.62)" />
          <circle cx="112" cy="37" r="2" fill="rgba(14,91,124,0.45)" />
        </pattern>
      </defs>
      <rect width="1440" height="56" fill="url(#regional-kutchi)" />
    </>
  );
}

function JaipuriPattern() {
  return (
    <>
      <defs>
        <pattern id="regional-jaipuri" x="0" y="0" width="112" height="56" patternUnits="userSpaceOnUse">
          <rect x="0" y="15" width="112" height="26" fill="rgba(255,253,248,0.58)" />
          <path d="M0 16H112M0 40H112" stroke="rgba(31,91,121,0.3)" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M24 28C24 20 31 16 36 22C42 16 50 20 48 28C48 36 40 39 36 45C32 39 24 36 24 28Z" fill="rgba(31,91,121,0.16)" stroke="rgba(31,91,121,0.5)" strokeWidth="1.2" />
          <path d="M76 28C76 20 83 16 88 22C94 16 102 20 100 28C100 36 92 39 88 45C84 39 76 36 76 28Z" fill="rgba(197,56,45,0.14)" stroke="rgba(197,56,45,0.48)" strokeWidth="1.2" />
          <circle cx="36" cy="28" r="5" fill="rgba(230,180,0,0.24)" stroke="rgba(230,180,0,0.5)" strokeWidth="1" />
          <circle cx="88" cy="28" r="5" fill="rgba(38,132,70,0.18)" stroke="rgba(38,132,70,0.45)" strokeWidth="1" />
          <path d="M8 28H18M54 28H66M104 28H114" stroke="rgba(139,26,26,0.28)" strokeWidth="1" strokeLinecap="round" />
          <path d="M58 18L64 28L58 38L52 28Z" fill="rgba(230,102,28,0.18)" stroke="rgba(230,102,28,0.42)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1440" height="56" fill="url(#regional-jaipuri)" />
    </>
  );
}

function BanarasiPattern() {
  return (
    <>
      <rect width="1440" height="56" fill="#24170e" />
      <defs>
        <pattern id="regional-banarasi" x="0" y="0" width="120" height="56" patternUnits="userSpaceOnUse">
          <path d="M0 12H120M0 44H120" stroke="rgba(247,209,84,0.46)" strokeWidth="1.2" strokeDasharray="6 5" />
          <path d="M18 28C28 8 52 8 62 28C52 48 28 48 18 28Z" fill="rgba(230,180,0,0.13)" stroke="rgba(247,209,84,0.58)" strokeWidth="1.2" />
          <path d="M58 28C68 8 92 8 102 28C92 48 68 48 58 28Z" fill="rgba(139,26,26,0.18)" stroke="rgba(247,209,84,0.42)" strokeWidth="1" />
          <path d="M40 16C48 22 48 34 40 40C32 34 32 22 40 16Z" fill="rgba(247,209,84,0.25)" />
          <circle cx="40" cy="28" r="3" fill="rgba(255,253,248,0.58)" />
          <circle cx="80" cy="28" r="3" fill="rgba(247,209,84,0.5)" />
          <path d="M0 28Q15 20 30 28T60 28T90 28T120 28" fill="none" stroke="rgba(247,209,84,0.32)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1440" height="56" fill="url(#regional-banarasi)" />
    </>
  );
}

function PhulkariPattern() {
  return (
    <>
      <rect width="1440" height="56" fill="#3a0b16" />
      <defs>
        <pattern id="regional-phulkari" x="0" y="0" width="96" height="56" patternUnits="userSpaceOnUse">
          <path d="M0 14H96M0 42H96" stroke="rgba(247,209,84,0.38)" strokeWidth="1" strokeDasharray="3 5" />
          <path d="M24 8L40 28L24 48L8 28Z" fill="rgba(230,180,0,0.34)" stroke="rgba(247,209,84,0.6)" strokeWidth="1" />
          <path d="M72 8L88 28L72 48L56 28Z" fill="rgba(230,102,28,0.34)" stroke="rgba(247,209,84,0.48)" strokeWidth="1" />
          <path d="M24 18L32 28L24 38L16 28Z" fill="rgba(199,42,94,0.5)" />
          <path d="M72 18L80 28L72 38L64 28Z" fill="rgba(38,132,70,0.5)" />
          <path d="M44 28H52M0 28H8M88 28H96" stroke="rgba(255,253,248,0.42)" strokeWidth="1.2" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="1440" height="56" fill="url(#regional-phulkari)" />
    </>
  );
}

function KalamkariPattern() {
  return (
    <>
      <defs>
        <pattern id="regional-kalamkari" x="0" y="0" width="128" height="56" patternUnits="userSpaceOnUse">
          <rect x="0" y="12" width="128" height="32" fill="rgba(245,230,192,0.36)" />
          <path d="M0 18H128M0 38H128" stroke="rgba(92,14,14,0.24)" strokeWidth="1" strokeDasharray="5 6" />
          <path d="M0 30C18 10 34 50 52 30S86 10 104 30S138 50 156 30" fill="none" stroke="rgba(92,14,14,0.42)" strokeWidth="1.4" />
          <path d="M34 23C26 14 18 18 16 28C26 30 33 29 34 23Z" fill="rgba(38,132,70,0.24)" stroke="rgba(38,132,70,0.46)" strokeWidth="1" />
          <path d="M82 33C90 42 98 38 100 28C90 26 83 27 82 33Z" fill="rgba(31,91,121,0.2)" stroke="rgba(31,91,121,0.42)" strokeWidth="1" />
          <path d="M58 18C66 20 70 28 64 36C56 34 52 26 58 18Z" fill="rgba(197,56,45,0.17)" stroke="rgba(197,56,45,0.42)" strokeWidth="1" />
          <circle cx="16" cy="28" r="2.2" fill="rgba(230,180,0,0.56)" />
          <circle cx="64" cy="36" r="2.2" fill="rgba(230,180,0,0.5)" />
          <circle cx="100" cy="28" r="2.2" fill="rgba(230,180,0,0.5)" />
        </pattern>
      </defs>
      <rect width="1440" height="56" fill="url(#regional-kalamkari)" />
    </>
  );
}
