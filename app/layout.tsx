import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Jost, Geist } from "next/font/google";
import CartProviderShell from "@/components/ecommerce/CartProviderShell";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel-var",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-var",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trinetra By Rajababu | Heritage Couture & Ethnic Wear",
  description:
    "Shop handcrafted bridal lehengas, dress materials, kurtas, chaniya cholis, blouses and heritage ethnic wear by Trinetra By Rajababu.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(cinzel.variable, cormorant.variable, jost.variable, "font-sans", geist.variable)}
    >
      <body>
        <CartProviderShell>{children}</CartProviderShell>
      </body>
    </html>
  );
}
