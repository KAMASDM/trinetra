import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LegalLayout({
  eyebrow,
  title,
  updatedAt,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen linen-bg pt-24 sm:pt-32 pb-20">
        <div className="absolute inset-0 bg-ivory/75" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <p className="eyebrow-stitch mb-5" style={{ color: "var(--crimson)" }}>{eyebrow}</p>
          <h1 className="heading-stitched text-3xl sm:text-4xl mb-3" style={{ color: "var(--crimson)" }}>{title}</h1>
          <p className="mb-10 text-xs uppercase tracking-[0.3em] text-taupe">Last updated: {updatedAt}</p>
          <div
            className="space-y-6 text-taupe leading-relaxed [&_h2]:font-cinzel [&_h2]:text-charcoal [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-3 [&_strong]:text-charcoal"
            style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.05rem" }}
          >
            {children}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
