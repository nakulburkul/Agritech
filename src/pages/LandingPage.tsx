import React from 'react';
import { Hero } from '../components/Hero';
import { BrandScrollTransition } from '../components/BrandScrollTransition';
import { CultivatingSection } from '../components/CultivatingSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { InnovationSection } from '../components/InnovationSection';

export function LandingPage() {
  return (
    <>
      <Hero />
      <BrandScrollTransition />
      <CultivatingSection />
      <FeaturesSection />
      <InnovationSection />
    </>
  );
}
