import Image from "next/image";
import Link from "next/link";
import { formatPrice, getFeaturedProducts } from "@/lib/products";

export default function FeaturedCommerce() {
  const featured = getFeaturedProducts();

  return (
    <section className="relative py-24 linen-bg" id="shop-preview">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow-stitch mb-4">Shop The Atelier</p>
            <h2 className="heading-stitched text-3xl md:text-4xl">Ready For Your Wardrobe</h2>
            <p className="mt-6 max-w-2xl text-taupe leading-relaxed" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem" }}>
              A first ecommerce layer for Trinetra: curated products, dispatch windows, customization signals and cart-ready buying journeys.
            </p>
          </div>
          <Link href="/shop" className="btn-gold w-fit">
            Visit Shop
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group border border-gold/20 bg-warm-white/80">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-[9px] uppercase tracking-[0.35em] text-gold">{product.category}</p>
                <h3 className="mt-2 font-cinzel text-base text-charcoal">{product.name}</h3>
                <p className="mt-3 text-sm text-crimson">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
