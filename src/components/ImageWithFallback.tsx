import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackCategory?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackCategory = 'AURA Salon',
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`bg-[#17171E] flex flex-col items-center justify-center text-center p-4 border border-[#272733] ${className}`}
      >
        <span className="font-serif text-lg tracking-widest text-[#C5A880]">AURA</span>
        <span className="text-[11px] uppercase tracking-wider text-[#9E9BA3] mt-1">
          {alt || fallbackCategory}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
};
