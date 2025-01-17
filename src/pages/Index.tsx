import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

export default function Index() {
  console.log("Index page rendering");
  
  return (
    <div className="container mx-auto">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}