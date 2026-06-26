"use client";

import { CartProvider, useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ConsultationProvider } from "@/components/ConsultationContext";
import ConsultationDrawer from "@/components/ConsultationDrawer";

function CartChrome({ children }: { children: React.ReactNode }) {
  const cart = useCart();

  return (
    <>
      <div className="pb-20 lg:pb-0">{children}</div>
      <CartDrawer open={cart.isDrawerOpen} onClose={cart.closeDrawer} />
      <MobileBottomNav />
      <ConsultationDrawer />
    </>
  );
}

export default function CartProviderShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ConsultationProvider>
        <CartChrome>{children}</CartChrome>
      </ConsultationProvider>
    </CartProvider>
  );
}
