import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface SlideContainerProps {
  children: ReactNode;
  gradient?: 'primary' | 'secondary' | 'warm' | 'cool' | 'sunset' | 'aurora';
  className?: string;
}

const gradientClasses = {
  primary: 'bg-gradient-primary',
  secondary: 'bg-gradient-secondary',
  warm: 'bg-gradient-warm',
  cool: 'bg-gradient-cool',
  sunset: 'bg-gradient-sunset',
  aurora: 'bg-gradient-aurora',
};

export const SlideContainer = forwardRef<HTMLDivElement, SlideContainerProps>(
  ({ children, gradient = 'primary', className }, ref) => {
    const blob1Ref = useRef<HTMLDivElement>(null);
    const blob2Ref = useRef<HTMLDivElement>(null);
    const blob3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (blob1Ref.current) {
        gsap.to(blob1Ref.current, {
          x: '+=30',
          y: '+=20',
          scale: 1.1,
          duration: 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      if (blob2Ref.current) {
        gsap.to(blob2Ref.current, {
          x: '-=40',
          y: '+=30',
          scale: 0.9,
          duration: 5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      if (blob3Ref.current) {
        gsap.to(blob3Ref.current, {
          x: '+=25',
          y: '-=25',
          scale: 1.15,
          duration: 4.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'wrapped-slide relative overflow-hidden',
          gradientClasses[gradient],
          className
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          ref={blob1Ref}
          className="blob w-64 h-64 bg-wrapped-pink/30 top-10 -left-20" 
          style={{ transform: 'translateZ(-50px)', willChange: 'transform' }} 
        />
        <div 
          ref={blob2Ref}
          className="blob w-80 h-80 bg-wrapped-purple/30 -bottom-20 -right-20" 
          style={{ transform: 'translateZ(-80px)', willChange: 'transform' }} 
        />
        <div 
          ref={blob3Ref}
          className="blob w-48 h-48 bg-wrapped-cyan/20 top-1/2 left-1/2" 
          style={{ transform: 'translateZ(-30px)', willChange: 'transform' }} 
        />
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </div>
    );
  }
);

SlideContainer.displayName = 'SlideContainer';

interface AnimatedTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedText = ({ children, delay = 0, className }: AnimatedTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 40,
        rotationX: -15,
        transformPerspective: 1000,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out',
      }
    );
  }, [delay]);

  return (
    <div
      ref={textRef}
      className={className}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
};

export const AnimatedNumber = ({ value, delay = 0, className }: { value: number | string; delay?: number; className?: string }) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ value: 0 });

  useEffect(() => {
    if (!numberRef.current) return;

    const targetValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, '')) || 0;

    gsap.fromTo(
      counterRef.current,
      { value: 0 },
      {
        value: targetValue,
        duration: 2,
        delay: delay,
        ease: 'power2.out',
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = Math.floor(counterRef.current.value).toLocaleString();
          }
        },
      }
    );

    gsap.fromTo(
      numberRef.current,
      { 
        opacity: 0,
        scale: 0.6,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: 'back.out(1.4)',
      }
    );
  }, [value, delay]);

  return (
    <span
      ref={numberRef}
      className={cn('stat-number text-gradient-primary inline-block', className)}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
    >
      0
    </span>
  );
};

export const AnimatedList = ({ items, delay = 0 }: { items: { label: string; value: string | number }[]; delay?: number }) => (
  <div className="space-y-3 w-full" style={{ transformStyle: 'preserve-3d' }}>
    {items.map((item, i) => (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, x: -20, z: -20 }}
        animate={{ opacity: 1, x: 0, z: 0 }}
        transition={{ duration: 0.4, delay: delay + i * 0.1 }}
        className="glass-card px-4 py-3 flex justify-between items-center"
        whileHover={{ scale: 1.02, z: 10 }}
      >
        <span className="text-foreground/80">{item.label}</span>
        <span className="font-bold text-foreground">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
      </motion.div>
    ))}
  </div>
);
