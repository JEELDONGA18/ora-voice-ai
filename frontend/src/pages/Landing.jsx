import React from "react";
import HeroSection from "../components/landing_page/HeroSection";
import VoiceSection from "../components/landing_page/VoiceSection";
import CarouselSection from "../components/landing_page/CarouselSection";
import FeaturesSection from "../components/landing_page/FeaturesSection";
import CTASection from "../components/landing_page/CTASection";
import Footer from "../components/landing_page/Footer";

export default function Landing() {
  return (
    <>
      <HeroSection />
      <VoiceSection />
      <CarouselSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
}