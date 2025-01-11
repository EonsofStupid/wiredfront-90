import React from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { useAuthStore } from "@/stores/auth";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // If user is authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Public landing page - always renders
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <main className="container mx-auto max-w-6xl">
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
}