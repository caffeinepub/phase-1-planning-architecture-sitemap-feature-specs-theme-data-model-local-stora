import { ReactNode, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export default function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      className={`flip-card ${isFlipped ? 'flipped' : ''} ${prefersReducedMotion ? 'no-motion' : ''} ${className}`}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={isFlipped ? 'Flip card to see front' : 'Flip card to see back'}
      aria-pressed={isFlipped}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front" aria-hidden={isFlipped}>
          {front}
        </div>
        <div className="flip-card-back" aria-hidden={!isFlipped}>
          {back}
        </div>
      </div>
    </div>
  );
}
