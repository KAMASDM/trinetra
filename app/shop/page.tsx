import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import { listPublishedProducts } from "@/lib/data/products";

export const metadata = {
  title: "Shop | Trinetra By Rajababu",
  description: "Shop Trinetra bridal lehengas, kurtas, chaniya cholis, dress materials, blouses and ethnic wear.",
};

// Catalog comes from Firestore. Cache the page and refresh periodically
// (and instantly on product create/update/delete via revalidatePath in
// app/admin/actions.ts) instead of querying Firestore on every visitor.
export const revalidate = 300;

export default async function ShopPage() {
  const products = await listPublishedProducts();

  return (
    <main>
      <Navbar />
      <section className="relative overflow-hidden bg-charcoal pt-32 pb-16 text-center">
        <div className="absolute inset-0 opacity-[0.06] linen-bg" />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="eyebrow-stitch mb-5" style={{ color: "#E4B84A" }}>The Atelier Catalog</p>
          <h1 className="font-cinzel text-5xl font-bold tracking-[0.16em] text-gold md:text-6xl">SHOP</h1>
          <p className="mt-6 text-gold-pale/70 leading-loose" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.15rem" }}>
            Browse ready-to-ship pieces, made-to-measure couture, festive collections and unstitched dress materials.
          </p>
        </div>
      </section>
      <Suspense>
        <ProductGrid products={products} />
      </Suspense>
      <Footer />
    </main>
  );
}
