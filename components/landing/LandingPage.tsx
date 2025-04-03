'use client';

import HeroSection from './HeroSection';
import TestimonialsSection from './TestimonialsSection';
import HowItWorksSection from './HowItWorksSection';
import StatsSection from './StatsSection';
import CtaSection from './CtaSection';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <StatsSection />
      <CtaSection />
    </div>
  );
} 