
import React from 'react';
import { cn } from '@/lib/utils';
import FadeIn from './animations/FadeIn';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section className={cn('relative min-h-screen flex items-center overflow-hidden', className)}>
      <div className="absolute inset-0 -z-10">
        <img 
          src="/lovable-uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png" 
          alt="Remote mountains of India" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10 max-w-4xl">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn delay={200}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white leading-tight mb-6">
              Hidden India
            </h1>
          </FadeIn>
          
          <FadeIn delay={300}>
            <p className="text-lg md:text-xl text-white/90 mb-4">
              Discover the untouched beauty of India's most remote destinations.
            </p>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              From secret valleys to forgotten temples, explore the India that few have seen.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Hero;
