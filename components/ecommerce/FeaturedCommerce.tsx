import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data/products";
import FeaturedProductCard from "./FeaturedProductCard";

export default async function FeaturedCommerce() {
  const featured = await getFeaturedProducts();

  return (
    <section className="relative py-16 sm:py-24 linen-bg" id="shop-preview">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-10 sm:mb-12">
          <p className="eyebrow-stitch mb-4" style={{ color: "var(--crimson)" }}>Shop The Atelier</p>
          <h2 className="heading-stitched text-2xl sm:text-3xl md:text-4xl" style={{ color: "var(--crimson)" }}>Ready For Your Wardrobe</h2>
          <p className="mt-6 max-w-2xl text-taupe leading-relaxed" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem" }}>
            A first ecommerce layer for Trinetra: curated products, dispatch windows, customization signals and cart-ready buying journeys.
          </p>
        </div>

        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <Link href="/shop" className="btn-gold">
            Visit Shop
          </Link>
        </div>
      </div>
    </section>
  );
}
