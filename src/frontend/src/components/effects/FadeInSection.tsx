import { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeInSection({ children, className = '', delay = 0 }: FadeInSectionProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      className={`fade-in-section ${isInView || prefersReducedMotion ? 'fade-in-visible' : ''} ${className}`}
      style={{
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
