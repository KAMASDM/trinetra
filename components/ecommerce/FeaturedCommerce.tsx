import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data/products";
import FeaturedProductCard from "./FeaturedProductCard";

export default async function FeaturedCommerce() {
  const featured = await getFeaturedProducts();

  return (
    <section className="relative py-16 sm:py-24 linen-bg" id="shop-preview">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-10 sm:mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow-stitch mb-4">Shop The Atelier</p>
            <h2 className="heading-stitched text-2xl sm:text-3xl md:text-4xl">Ready For Your Wardrobe</h2>
            <p className="mt-6 max-w-2xl text-taupe leading-relaxed" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem" }}>
              A first ecommerce layer for Trinetra: curated products, dispatch windows, customization signals and cart-ready buying journeys.
            </p>
          </div>
          <Link href="/shop" className="btn-gold w-fit">
            Visit Shop
          </Link>
        </div>

        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
