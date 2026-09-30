import React from 'react';
import { Hero } from '../components/Hero';
import { BrandScrollTransition } from '../components/BrandScrollTransition';
import { CultivatingSection } from '../components/CultivatingSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { InnovationSection } from '../components/InnovationSection';
import { DotNavigation } from '../components/DotNavigation';

export function LandingPage() {
  return (
    <div className="relative">
      <DotNavigation />
      
      <section id="hero">
        <Hero />
      </section>
      
      <section id="brand">
        <BrandScrollTransition />
      </section>
      
      <section id="cultivating">
        <CultivatingSection />
      </section>
      
      <section id="features">
        <FeaturesSection />
      </section>
      
      <section id="innovation">
        <InnovationSection />
      </section>
    </div>
  );
}