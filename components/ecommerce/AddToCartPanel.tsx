"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./CartContext";

export default function AddToCartPanel({ product }: { product: Product }) {
  const cart = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.inventory <= 0;
  const lowStock = !outOfStock && product.inventory <= 5;

  return (
    <div className="border border-gold/25 bg-warm-white/70 p-5">
      {(outOfStock || lowStock) && (
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-crimson">
          {outOfStock ? "Out of stock" : `Only ${product.inventory} left`}
        </p>
      )}
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.35em] text-taupe mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSize(option)}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition ${
                size === option ? "border-crimson bg-crimson text-warm-white" : "border-gold/30 text-charcoal"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.35em] text-taupe mb-3">Colour</p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setColor(option)}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition ${
                color === option ? "border-gold bg-gold text-charcoal" : "border-gold/30 text-charcoal"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <p className="text-[10px] uppercase tracking-[0.35em] text-taupe">Qty</p>
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          className="h-9 w-9 border border-gold/30 text-charcoal"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-8 text-center font-cinzel text-sm">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.min(product.inventory, current + 1))}
          className="h-9 w-9 border border-gold/30 text-charcoal"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={outOfStock}
        className="btn-gold w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={() => {
          cart.addItem(product, { color, quantity, size });
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1800);
        }}
      >
        {outOfStock ? "Out Of Stock" : added ? "Added To Cart" : "Add To Cart"}
      </button>

      {product.customizable && (
        <a href="/checkout?mode=consult" className="btn-outline-gold mt-3 w-full justify-center !text-crimson !border-crimson/40">
          Request Custom Fitting
        </a>
      )}
    </div>
  );
}
