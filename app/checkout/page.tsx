import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/ecommerce/CheckoutForm";

export const metadata = {
  title: "Checkout | Trinetra By Rajababu",
};

export default function CheckoutPage() {
  return (
    <main>
      <Navbar />
      <CheckoutForm />
      <Footer />
    </main>
  );
}
