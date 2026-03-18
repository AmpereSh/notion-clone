import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import LogoStrip from "@/components/landing/LogoStrip";
import Features from "@/components/landing/Features";
import DeepDive from "@/components/landing/DeepDive";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />
      <LogoStrip />
      <Features />
      <DeepDive />
      <CTASection />
      <Footer />
    </main>
  );
}
