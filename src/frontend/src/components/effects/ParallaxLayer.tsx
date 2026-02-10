import { ReactNode, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxLayer({ children, speed = 0.5, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    const handleScroll = () => {
      if (!ref.current) return;
      const scrolled = window.scrollY;
      const yPos = -(scrolled * speed);
      ref.current.style.transform = `translateY(${yPos}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={ref} className={`parallax-layer ${className}`}>
      {children}
    </div>
  );
}
