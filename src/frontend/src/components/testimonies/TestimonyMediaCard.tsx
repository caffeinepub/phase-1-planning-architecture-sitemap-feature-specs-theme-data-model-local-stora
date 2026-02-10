import { useState, useRef, useEffect } from 'react';
import FlipCard from '../effects/FlipCard';
import { Card, CardContent } from '@/components/ui/card';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface TestimonyMediaCardProps {
  mediaUrl: string;
  description: string;
  isVideo: boolean;
}

export default function TestimonyMediaCard({ mediaUrl, description, isVideo }: TestimonyMediaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;

    if (isHovered && !isFlipped) {
      video.play().catch(() => {
        // Ignore autoplay errors
      });
    } else {
      video.pause();
    }
  }, [isHovered, isFlipped, isVideo]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const front = (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            className="w-full h-full object-cover rounded-lg"
            muted
            loop
            playsInline
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center rounded-lg transition-transform"
            style={{
              backgroundImage: `url(${mediaUrl})`,
              transform: isHovered && !prefersReducedMotion ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  const back = (
    <Card className="h-full">
      <CardContent className="p-6 h-full flex items-center justify-center">
        <p className="text-sm text-center overflow-y-auto max-h-full">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div
      className="h-80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleFlip}
    >
      <FlipCard front={front} back={back} className="h-full cursor-pointer" />
    </div>
  );
}
