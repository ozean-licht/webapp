'use client';

import { useEffect, useRef } from 'react';

interface BackgroundWaterRaysDesignProps {
  height?: string;
  className?: string;
}

export default function BackgroundWaterRaysDesign({
  height = "h-96",
  className = ""
}: BackgroundWaterRaysDesignProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Silent catch for autoplay issues
      });
    }
  }, []);

  return (
    <div className={`relative w-full ${height} overflow-hidden pointer-events-none ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        {/* Desktop Version */}
        <source
          media="(min-width: 1024px)"
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/background_videos/BackroundWaterEffect_Desktop.mp4"
        />
        {/* Tablet Version */}
        <source
          media="(min-width: 768px)"
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/background_videos/BackroundWaterEffect_Tablet.mp4"
        />
        {/* Mobile Version */}
        <source
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/background_videos/BackroundWaterEffect_Mobile.mp4"
        />
        {/* Fallback */}
        Ihr Browser unterstützt das Video-Element nicht.
      </video>

      {/* Gradient Overlay for Fading */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/90" />

      {/* Additional Light Rays Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
    </div>
  );
}
