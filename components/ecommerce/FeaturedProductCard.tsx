"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { useCart } from "./CartContext";

export default function FeaturedProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.inventory <= 0;

  return (
    <div className="group border border-gold/20 bg-warm-white/80">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition duration-700 group-hover:scale-105"
          />
          {product.inventory > 0 && product.inventory <= 5 && (
            <span className="absolute right-2 top-2 bg-crimson px-2 py-1 text-[8px] uppercase tracking-[0.2em] text-warm-white">
              Only {product.inventory} Left
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <p className="text-[9px] uppercase tracking-[0.35em] text-crimson">{product.category}</p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="mt-2 font-cinzel text-base text-charcoal">{product.name}</h3>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-crimson">{formatPrice(product.price)}</p>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              cart.addItem(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1500);
            }}
            className="border border-gold/40 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-charcoal hover:bg-gold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {outOfStock ? "Sold Out" : added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
