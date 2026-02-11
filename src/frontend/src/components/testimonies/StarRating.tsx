import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export default function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(rating, maxRating));

  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${clampedRating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFull = clampedRating >= starValue;
        const isHalf = clampedRating >= starValue - 0.5 && clampedRating < starValue;

        return (
          <div key={index} className="relative">
            <Star
              className={`h-5 w-5 ${
                isFull
                  ? 'fill-testimony-star text-testimony-star testimony-star-glow'
                  : 'fill-none text-muted-foreground'
              }`}
              aria-hidden="true"
            />
            {isHalf && !isFull && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star
                  className="h-5 w-5 fill-testimony-star text-testimony-star testimony-star-glow"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
