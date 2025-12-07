import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface OdometerNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  format?: (value: number) => string;
}

export const OdometerNumber = ({ 
  value, 
  duration = 2, 
  delay = 0, 
  className = '', 
  format = (v) => v.toLocaleString() 
}: OdometerNumberProps) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ value: 0 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!numberRef.current || hasAnimated.current) return;
    
    hasAnimated.current = true;

    const counterTween = gsap.fromTo(
      counterRef.current,
      { value: 0 },
      {
        value: value,
        duration: duration,
        delay: delay,
        ease: 'power2.out',
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = format(Math.floor(counterRef.current.value));
          }
        },
      }
    );

    const scaleTween = gsap.fromTo(
      numberRef.current,
      { 
        scale: 0.5, 
        opacity: 0,
        y: 20,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: delay,
        ease: 'back.out(1.7)',
      }
    );

    return () => {
      counterTween.kill();
      scaleTween.kill();
    };
  }, [value, duration, delay, format]);

  return (
    <span 
      ref={numberRef} 
      className={`inline-block ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      0
    </span>
  );
};
