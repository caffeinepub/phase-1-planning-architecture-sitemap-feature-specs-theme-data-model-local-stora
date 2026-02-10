import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export default function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(rating, maxRating));

  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${clampedRating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < clampedRating
              ? 'fill-testimony-star text-testimony-star testimony-star-glow'
              : 'fill-none text-muted-foreground'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
