import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartPanel from "@/components/ecommerce/AddToCartPanel";
import { formatPrice } from "@/lib/products";
import { getProductBySlug } from "@/lib/data/products";

// Product detail is read live from Firestore, so render per-request rather than at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} | Trinetra By Rajababu` : "Product | Trinetra",
    description: product?.story,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "published") notFound();

  return (
    <main>
      <Navbar />
      <section className="linen-bg relative pt-28 pb-16">
        <div className="absolute inset-0 bg-ivory/75" />
        <div className="relative max-w-7xl mx-auto px-6">
          <Link href="/shop" className="text-[11px] uppercase tracking-[0.3em] text-crimson">Back to shop</Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_460px]">
            <div>
              <div className="relative h-[620px] overflow-hidden border border-gold/25 bg-charcoal">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {product.gallery.map((image) => (
                  <div key={image} className="relative h-36 overflow-hidden border border-gold/20">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 33vw, 240px"
                      className="object-cover object-top"
                    />
                  </div>
                ))}
              </div>
            </div>

            <aside>
              <p className="eyebrow-stitch mb-5">{product.category}</p>
              <h1 className="font-cinzel text-4xl leading-tight text-charcoal">{product.name}</h1>
              <div className="mt-5 flex items-baseline gap-3">
                <p className="font-cinzel text-2xl text-crimson">{formatPrice(product.price)}</p>
                {product.compareAtPrice && <p className="text-sm text-taupe line-through">{formatPrice(product.compareAtPrice)}</p>}
              </div>
              <p className="mt-6 text-lg leading-loose text-taupe" style={{ fontFamily: "var(--font-cormorant), serif" }}>{product.story}</p>

              <div className="my-8 grid grid-cols-2 gap-3">
                {[
                  ["Fabric", product.fabric],
                  ["Dispatch", product.dispatch],
                  ["Stock", `${product.inventory} available`],
                  ["Custom", product.customizable ? "Available" : "No"],
                ].map(([label, value]) => (
                  <div key={label} className="border border-gold/20 bg-warm-white/70 p-4">
                    <p className="text-[9px] uppercase tracking-[0.35em] text-gold">{label}</p>
                    <p className="mt-2 text-sm text-charcoal">{value}</p>
                  </div>
                ))}
              </div>

              <AddToCartPanel product={product} />

              <div className="mt-8 border border-gold/20 bg-warm-white/70 p-5">
                <p className="font-cinzel text-lg text-crimson">Craft Notes</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.craft.map((craft) => (
                    <span key={craft} className="border border-gold/25 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-charcoal">{craft}</span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-taupe">{product.description}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
