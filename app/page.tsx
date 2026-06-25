import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import FeaturedCommerce from "@/components/ecommerce/FeaturedCommerce";
import CollectionsSection from "@/components/CollectionsSection";
import HeritageSection from "@/components/HeritageSection";
import BridalSection from "@/components/BridalSection";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

// Featured products are read live from Firestore via FeaturedCommerce, so
// this page is rendered per-request rather than prerendered at build time.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <FeaturedCommerce />
      <CollectionsSection />
      <HeritageSection />
      <BridalSection />
      <CraftsmanshipSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
