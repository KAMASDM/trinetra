"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, productCategories, type Product } from "@/lib/products";
import { useCart } from "./CartContext";

const sortOptions = ["Featured", "Price: Low To High", "Price: High To Low", "Newest"] as const;

export default function ProductGrid({ products }: { products: Product[] }) {
  const cart = useCart();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Featured");
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchable = `${product.name} ${product.category} ${product.fabric} ${product.craft.join(" ")}`.toLowerCase();
      return matchesCategory && searchable.includes(query.toLowerCase());
    });

    return filtered.toSorted((a, b) => {
      if (sort === "Price: Low To High") return a.price - b.price;
      if (sort === "Price: High To Low") return b.price - a.price;
      if (sort === "Newest") return Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival));
      return Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller));
    });
  }, [category, products, query, sort]);

  return (
    <section className="linen-bg relative py-16">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="border border-gold/20 bg-warm-white/70 p-5 h-fit">
            <p className="eyebrow-stitch mb-5">Refine</p>
            <label className="block mb-5">
              <span className="text-[10px] tracking-[0.35em] uppercase text-taupe">Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Kurta, zardozi, silk..."
                className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 text-sm outline-none focus:border-crimson"
              />
            </label>
            <label className="block mb-6">
              <span className="text-[10px] tracking-[0.35em] uppercase text-taupe">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as (typeof sortOptions)[number])}
                className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 text-sm outline-none focus:border-crimson"
              >
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <div className="space-y-2">
              {["All", ...productCategories].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  className={`w-full border px-3 py-3 text-left text-[11px] uppercase tracking-[0.22em] transition ${
                    category === option ? "border-crimson bg-crimson text-warm-white" : "border-gold/20 text-charcoal hover:border-gold"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm text-taupe">{visibleProducts.length} atelier pieces</p>
              <Link href="/cart" className="text-[11px] uppercase tracking-[0.3em] text-crimson">
                Cart ({cart.count})
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <article key={product.id} className="group border border-gold/20 bg-warm-white/80">
                  <Link href={`/shop/${product.slug}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                      {product.badge && (
                        <span className="absolute left-3 top-3 bg-gold px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-charcoal">
                          {product.badge}
                        </span>
                      )}
                      {product.inventory <= 5 && (
                        <span className="absolute right-3 top-3 bg-crimson px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-warm-white">
                          {product.inventory <= 0 ? "Out Of Stock" : `Only ${product.inventory} Left`}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{product.category}</p>
                    <Link href={`/shop/${product.slug}`}>
                      <h2 className="mt-2 font-cinzel text-lg text-charcoal">{product.name}</h2>
                    </Link>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-taupe">{product.story}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-cinzel text-base text-crimson">{formatPrice(product.price)}</p>
                      <button
                        type="button"
                        disabled={product.inventory <= 0}
                        onClick={() => {
                          cart.addItem(product);
                          setJustAdded(product.id);
                          window.setTimeout(() => setJustAdded(null), 1500);
                        }}
                        className="border border-gold/40 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-charcoal hover:bg-gold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {justAdded === product.id ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
