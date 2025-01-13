import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export default function Index() {
  console.log("Index page rendering");
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <main className="container mx-auto max-w-6xl">
          <HeroSection />
          <FeaturesSection />
        </main>
      </div>
    </ErrorBoundary>
  );
}