
import React from 'react';
import { cn } from '@/lib/utils';
import FadeIn from './animations/FadeIn';

interface AboutProps {
  className?: string;
}

const About: React.FC<AboutProps> = ({ className }) => {
  return (
    <section id="about" className={cn('py-20 md:py-32 bg-gray-50', className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">
          <FadeIn className="md:col-span-5">
            <div className="flex flex-col space-y-6">
              <div>
                <span className="text-sm md:text-base font-medium text-orange-600 mb-2 inline-block">Our Mission</span>
                <h2 className="text-3xl md:text-5xl font-serif font-medium tracking-tight mb-6">We started in 2025 with a passion for the unexplored</h2>
              </div>
              
              <p className="text-lg text-muted-foreground">
                To showcase India's most remote and breathtaking destinations that remain hidden from mainstream tourism.
              </p>
              <p className="text-lg text-muted-foreground">
                We believe in sustainable travel that respects local communities and preserves the pristine beauty of these untouched locations for future generations.
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay={150} className="md:col-span-7">
            <div className="relative h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png"
                alt="Remote temple architecture in the mountains"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default About;
