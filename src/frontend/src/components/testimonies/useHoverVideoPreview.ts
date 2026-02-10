import { useEffect, useRef } from 'react';

interface UseHoverVideoPreviewOptions {
  isHovered: boolean;
  isFlipped: boolean;
  enabled: boolean;
}

export function useHoverVideoPreview({ isHovered, isFlipped, enabled }: UseHoverVideoPreviewOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!enabled || !videoRef.current) return;

    const video = videoRef.current;

    if (isHovered && !isFlipped) {
      video.play().catch(() => {
        // Ignore autoplay errors (browser policy)
      });
    } else {
      video.pause();
    }
  }, [isHovered, isFlipped, enabled]);

  return videoRef;
}
