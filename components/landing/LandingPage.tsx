'use client';

import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import HowItWorksSection from './HowItWorksSection';
import StatsSection from './StatsSection';
import CtaSection from './CtaSection';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <StatsSection />
      <CtaSection />
    </div>
  );
} 