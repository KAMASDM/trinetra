import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationForm from "@/components/ConsultationForm";

export const metadata = {
  title: "Book a Consultation | Trinetra By Rajababu",
  description: "Book a bridal, styling or tailoring consultation with Trinetra By Rajababu.",
};

export default function BookConsultationPage() {
  return (
    <main>
      <Navbar />
      <section className="relative linen-bg pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-ivory/75" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <p className="eyebrow-stitch mb-5 text-center" style={{ color: "var(--crimson)" }}>Begin Your Journey</p>
          <h1 className="heading-stitched text-3xl sm:text-4xl mb-4 text-center" style={{ color: "var(--crimson)" }}>
            Book A Consultation
          </h1>
          <p className="text-taupe text-center mb-10 max-w-lg mx-auto" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem" }}>
            Tell us a little about what you&rsquo;re looking for and our design team will reach out to schedule
            your personal consultation.
          </p>
          <ConsultationForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
