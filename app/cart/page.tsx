import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartView from "@/components/ecommerce/CartView";

export const metadata = {
  title: "Cart | Trinetra By Rajababu",
};

export default function CartPage() {
  return (
    <main>
      <Navbar />
      <CartView />
      <Footer />
    </main>
  );
}
