import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
    </MainLayout>
  );
};

export default Index;