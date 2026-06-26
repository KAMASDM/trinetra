"use client";

import { CartProvider, useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

function CartChrome({ children }: { children: React.ReactNode }) {
  const cart = useCart();

  return (
    <>
      <div className="pb-20 lg:pb-0">{children}</div>
      <CartDrawer open={cart.isDrawerOpen} onClose={cart.closeDrawer} />
      <MobileBottomNav />
    </>
  );
}

export default function CartProviderShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CartChrome>{children}</CartChrome>
    </CartProvider>
  );
}
