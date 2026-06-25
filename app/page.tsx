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

// Featured products come from Firestore via FeaturedCommerce. Cache the
// rendered page and refresh it periodically (and instantly on product
// create/update/delete via revalidatePath in app/admin/actions.ts) instead
// of hitting Firestore on every single visitor.
export const revalidate = 300;

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
