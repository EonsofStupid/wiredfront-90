import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Index() {
  console.log("Index page rendering");
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <HeroSection />
        <FeaturesSection />
      </div>
    </MainLayout>
  );
}