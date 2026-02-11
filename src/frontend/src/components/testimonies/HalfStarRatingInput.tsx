import { Star } from 'lucide-react';
import { useState } from 'react';

interface HalfStarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxRating?: number;
}

export default function HalfStarRatingInput({ 
  value, 
  onChange, 
  maxRating = 5 
}: HalfStarRatingInputProps) {
  const [hoveredValue, setHoveredValue] = useState<number>(0);

  const handleClick = (starIndex: number, isHalf: boolean) => {
    const newValue = starIndex + (isHalf ? 0.5 : 1);
    onChange(newValue);
  };

  const handleMouseMove = (starIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoveredValue(starIndex + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => {
    setHoveredValue(0);
  };

  const displayValue = hoveredValue || value;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFull = displayValue >= starValue;
        const isHalf = displayValue >= starValue - 0.5 && displayValue < starValue;

        return (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const isHalfClick = x < rect.width / 2;
              handleClick(index, isHalfClick);
            }}
            onMouseMove={(e) => handleMouseMove(index, e)}
            onMouseLeave={handleMouseLeave}
            className="relative transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                isFull
                  ? 'fill-arcane-gold text-arcane-gold'
                  : isHalf
                  ? 'text-arcane-gold'
                  : 'text-muted-foreground'
              }`}
            />
            {isHalf && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star className="h-8 w-8 fill-arcane-gold text-arcane-gold" />
              </div>
            )}
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value.toFixed(1)} {value === 1 ? 'star' : 'stars'}
        </span>
      )}
    </div>
  );
}
