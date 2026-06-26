"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice, productCategories, type Product } from "@/lib/products";
import { useCart } from "./CartContext";

const sortOptions = ["Featured", "Price: Low To High", "Price: High To Low", "Newest"] as const;
type SortOption = (typeof sortOptions)[number];

function useProductFilters(products: Product[]) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const [category, setCategory] = useState(
    productCategories.includes(initialCategory as (typeof productCategories)[number]) ? initialCategory : "All",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Featured");

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

  return { category, setCategory, query, setQuery, sort, setSort, visibleProducts };
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const filters = useProductFilters(products);

  return (
    <section className="linen-bg relative py-6 sm:py-16">
      <div className="absolute inset-0 bg-ivory/75" />
      <div className="relative">
        <div className="hidden lg:block max-w-7xl mx-auto px-6">
          <DesktopLayout {...filters} />
        </div>
        <div className="lg:hidden">
          <MobileLayout {...filters} />
        </div>
      </div>
    </section>
  );
}

type FiltersState = ReturnType<typeof useProductFilters>;

function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const [justAdded, setJustAdded] = useState(false);

  return (
    <article className="group border border-gold/20 bg-warm-white/80">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
            className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
          {product.badge && (
            <span className="absolute left-2 top-2 sm:left-3 sm:top-3 bg-gold px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.28em] text-charcoal">
              {product.badge}
            </span>
          )}
          {product.inventory <= 5 && (
            <span className="absolute right-2 top-2 sm:right-3 sm:top-3 bg-crimson px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.28em] text-warm-white">
              {product.inventory <= 0 ? "Out Of Stock" : `${product.inventory} Left`}
            </span>
          )}
        </div>
      </Link>
      <div className="p-3 sm:p-5">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-crimson">{product.category}</p>
        <Link href={`/shop/${product.slug}`}>
          <h2 className="mt-1 sm:mt-2 font-cinzel text-sm sm:text-lg text-charcoal">{product.name}</h2>
        </Link>
        <p className="mt-1 sm:mt-2 line-clamp-2 hidden sm:block text-sm leading-relaxed text-taupe">{product.story}</p>
        <div className="mt-2 sm:mt-4 flex items-center justify-between gap-2 sm:gap-3">
          <p className="font-cinzel text-sm sm:text-base text-crimson">{formatPrice(product.price)}</p>
          <button
            type="button"
            disabled={product.inventory <= 0}
            onClick={() => {
              cart.addItem(product);
              setJustAdded(true);
              window.setTimeout(() => setJustAdded(false), 1500);
            }}
            className="border border-gold/40 px-2.5 sm:px-3 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-charcoal hover:bg-gold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {justAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

function DesktopLayout({ category, setCategory, query, setQuery, sort, setSort, visibleProducts }: FiltersState) {
  const cart = useCart();

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="border border-gold/20 bg-warm-white/70 p-5 h-fit">
        <p className="eyebrow-stitch mb-5" style={{ color: "var(--crimson)" }}>Refine</p>
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
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="mt-2 w-full border border-gold/25 bg-ivory px-3 py-3 text-sm outline-none focus:border-crimson"
          >
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-2">
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
        <div className="grid gap-5 grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );
}

function MobileLayout({ category, setCategory, query, setQuery, sort, setSort, visibleProducts }: FiltersState) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState(category);
  const [draftSort, setDraftSort] = useState(sort);

  function openSheet() {
    setDraftCategory(category);
    setDraftSort(sort);
    setSheetOpen(true);
  }

  function applyFilters() {
    setCategory(draftCategory);
    setSort(draftSort);
    setSheetOpen(false);
  }

  return (
    <div className="px-4">
      {/* Search */}
      <div className="relative mb-3">
        <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search kurta, zardozi, silk..."
          className="w-full border border-gold/25 bg-warm-white py-3 pl-9 pr-3 text-sm outline-none focus:border-crimson"
        />
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={openSheet}
          className="flex items-center gap-2 border border-gold/30 bg-warm-white px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-charcoal"
        >
          <FilterIcon />
          Filter & Sort
          {category !== "All" && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-crimson" />}
        </button>
        <p className="text-xs text-taupe">{visibleProducts.length} pieces</p>
      </div>

      {category !== "All" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 border border-crimson/30 bg-crimson/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-crimson">
            {category}
            <button type="button" onClick={() => setCategory("All")} aria-label="Clear category filter">
              ✕
            </button>
          </span>
        </div>
      )}

      {/* Product grid */}
      <div className="grid gap-3 grid-cols-2">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {visibleProducts.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-taupe">No pieces match your search.</p>
        )}
      </div>

      {/* Filter & Sort bottom sheet */}
      {sheetOpen && (
        <>
          <div className="fixed inset-0 z-[70] bg-charcoal/60" onClick={() => setSheetOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-[80] max-h-[80vh] overflow-y-auto rounded-t-2xl bg-warm-white pb-[calc(env(safe-area-inset-bottom)+5rem)]">
            <div className="flex items-center justify-between border-b border-gold/15 px-5 py-4">
              <p className="font-cinzel text-lg text-charcoal">Filter & Sort</p>
              <button type="button" onClick={() => setSheetOpen(false)} aria-label="Close" className="text-taupe text-xl leading-none">
                ✕
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-taupe mb-3">Category</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["All", ...productCategories].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDraftCategory(option)}
                    className={`border px-3 py-3 text-left text-[11px] uppercase tracking-[0.15em] transition ${
                      draftCategory === option ? "border-crimson bg-crimson text-warm-white" : "border-gold/20 text-charcoal"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <p className="text-[10px] uppercase tracking-[0.3em] text-taupe mb-3">Sort By</p>
              <div className="flex flex-col gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDraftSort(option)}
                    className={`flex items-center justify-between border px-3 py-3 text-left text-sm transition ${
                      draftSort === option ? "border-crimson text-crimson" : "border-gold/20 text-charcoal"
                    }`}
                  >
                    {option}
                    {draftSort === option && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-gold/15 bg-warm-white p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
              <button type="button" onClick={applyFilters} className="btn-gold w-full justify-center">
                Show Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
