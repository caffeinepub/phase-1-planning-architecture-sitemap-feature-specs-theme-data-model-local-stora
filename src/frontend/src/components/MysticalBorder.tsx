import React from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface MysticalBorderProps {
  children: React.ReactNode;
  className?: string;
}

export default function MysticalBorder({ children, className = '' }: MysticalBorderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={`
        mystical-border-wrapper
        relative
        rounded-lg
        border-2
        border-arcane-gold/40
        bg-card/80
        backdrop-blur-sm
        p-6
        md:p-8
        transition-all
        duration-600
        ${!prefersReducedMotion ? 'hover:border-arcane-gold/70 hover:shadow-glow hover:-translate-y-1 hover:scale-[1.01]' : ''}
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-arcane-gold
        focus-visible:ring-offset-2
        ${className}
      `}
      tabIndex={0}
      role="region"
      aria-label="Mystical content section"
    >
      {/* Animated corner glints */}
      {!prefersReducedMotion && (
        <>
          <div className="mystical-glint mystical-glint-tl" aria-hidden="true" />
          <div className="mystical-glint mystical-glint-tr" aria-hidden="true" />
          <div className="mystical-glint mystical-glint-bl" aria-hidden="true" />
          <div className="mystical-glint mystical-glint-br" aria-hidden="true" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
