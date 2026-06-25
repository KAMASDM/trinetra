"use client";

import { CartProvider } from "./CartContext";

export default function CartProviderShell({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
